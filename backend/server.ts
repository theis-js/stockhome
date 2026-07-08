import type {NextFunction, Request, Response} from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql, {type ResultSetHeader, type RowDataPacket} from "mysql2";
import {readFile} from "fs/promises";
// frontend routes
import userRouter from "./routes/app/users.route";
import productRouter from "./routes/app/products.route";
import storageRouter from "./routes/app/storage.route";
import path from "node:path";

dotenv.config();
const app = express();
app.set("view engine", "ejs");

const port = 8004;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const pool = mysql
    .createPool({
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
    })
    .promise();

app.use("/users", userRouter);

app.use("/products", productRouter);

app.use("/storage", storageRouter);

app.listen(port, () => {
    runStartup(port);
});

// Startup code
const runStartup = async (port: number) => {
    let firstStartupValue: string | null = null;
    try {
        const [firstResponse] = await pool.query<RowDataPacket[]>(
            `SELECT value
             FROM app_settings
             WHERE name = "first-startup";`,
        );
        firstStartupValue = firstResponse[0]?.value ?? null;
    } catch (err: unknown) {
        if (err instanceof Error && (err as NodeJS.ErrnoException & { code?: string }).code !== "ER_NO_SUCH_TABLE") {
            throw err;
        }
    }

    if (firstStartupValue !== "false") {
        const schemaPath = path.join(__dirname, "database.scheme.sql");
        const schemaSql = await readFile(schemaPath, "utf8");
        const statements = schemaSql
            .split(";")
            .map((statement: string) => statement.trim())
            .filter((statement: string) => statement.length > 0);

        for (const statement of statements) {
            await pool.query(statement);
        }

        const [result] = await pool.query<RowDataPacket[]>(
            `SELECT value
             FROM app_settings
             WHERE name = "first-startup";`,
        );

        if (result[0]?.value === "true") {
            const insertResult = await insertFirstData();

            if (insertResult.affectedRows > 0) {
                console.log("Successfully created admin user!");
                console.log("Username: admin");
                console.log("Password: admin");

                const [scndResponse] = await pool.query<ResultSetHeader>(
                    `UPDATE app_settings
                     SET value = "false"
                     WHERE name = "first-startup";`,
                );

                if (scndResponse.affectedRows > 0) {
                    console.log("Database settet up successfully!");
                } else {
                    console.error("There was an error while setting up the database!");
                }
            } else {
                console.error("Error while creating admin user.");
            }
        }
    }

    console.log("Everything is settet up successfully!");
    console.log(`Backend is running on http://localhost:${port}`);
};

const insertFirstData = async (): Promise<ResultSetHeader> => {
    const [insertResult] = await pool.query<ResultSetHeader>(
        `INSERT INTO users (username, first_name, last_name, email, password, is_admin)
         VALUES ("admin", "admin", "admin", "admin@example.com", "admin", 1)`,
    );

    await pool.query(
        `INSERT INTO storage_locations (name, description)
         VALUES (?, ?);`,
        ["Default Storage", "Initial storage location"],
    );

    const [storageRows] = await pool.query<RowDataPacket[]>(
        `SELECT uuid
         FROM storage_locations
         WHERE name = ? LIMIT 1;`,
        ["Default Storage"],
    );

    const storageUuid: string | null = storageRows[0]?.uuid ?? null;
    if (storageUuid) {
        await pool.query(
            `INSERT INTO products (name, description, price, amount, storage_location, picture)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [
                "Welcome Product",
                "Your first item in Stockhome",
                "0.00",
                1,
                storageUuid,
                null,
            ],
        );
    }

    console.log("Welcome product is ready...");
    return insertResult;
};

// error handling code
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});