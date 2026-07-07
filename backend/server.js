import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import { readFile } from "fs/promises";
dotenv.config();
const app = express();
app.set("view engine", "ejs");

const port = 8004;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

// frontend routes
import userRouter from "./routes/app/users.route.js";
app.use("/users", userRouter);

import productRouter from "./routes/app/products.route.js";
app.use("/products", productRouter);

import storageRouter from "./routes/app/storage.route.js";
app.use("/storage", storageRouter);

app.listen(port, () => {
  runStartup(port);
});

// Startup code
const runStartup = async (port) => {
  // Check if database is configured; create schema if app_settings is missing.
  let firstStartupValue = null;
  try {
    const [firstResponse] = await pool.query(
      `SELECT value FROM app_settings WHERE name = "first-startup";`,
    );
    firstStartupValue = firstResponse[0]?.value ?? null;
  } catch (err) {
    if (err?.code !== "ER_NO_SUCH_TABLE") {
      throw err;
    }
  }

  if (firstStartupValue !== "false") {
    const schemaPath = new URL("./database.scheme.sql", import.meta.url);
    const schemaSql = await readFile(schemaPath, "utf8");
    const statements = schemaSql
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    for (const statement of statements) {
      await pool.query(statement);
    }

    // create admin credentials
    const [result] = await pool.query(
      `SELECT value FROM app_settings WHERE name = "first-startup";`,
    );

    if (result[0]?.value === "true") {
      const insertResult = await insertFirstData();

      if (insertResult.affectedRows > 0) {
        // print out admin credentials
        console.log("Successfully created admin user!");
        console.log("Username: admin");
        console.log("Password: admin");

        // Set startup variable to true if scheme insert was successfull
        const [scndResponse] = await pool.query(
          `UPDATE app_settings SET value = "false" WHERE name = "first-startup";`,
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

const insertFirstData = async () => {
  const [insertResult] = await pool.query(
    `INSERT INTO users (username, first_name, last_name, email, password, is_admin) VALUES ("admin", "admin", "admin", "admin@example.com", "admin", 1)`,
  );

  await pool.query(
    `INSERT INTO storage_locations (name, description) VALUES (?, ?);`,
    ["Default Storage", "Initial storage location"],
  );

  const [storageRows] = await pool.query(
    `SELECT uuid FROM storage_locations WHERE name = ? LIMIT 1;`,
    ["Default Storage"],
  );

  const storageUuid = storageRows[0]?.uuid ?? null;
  if (storageUuid) {
    await pool.query(
      `INSERT INTO products (name, description, price, amount, storage_location, picture) VALUES (?, ?, ?, ?, ?, ?);`,
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

  console.log("Welcome product is ready...")
  return insertResult;
};

// error handling code
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
