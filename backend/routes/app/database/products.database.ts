import mysql, {type ResultSetHeader, type RowDataPacket} from "mysql2/promise";
import dotenv from "dotenv";
import {returnErrorCode} from "../../../services/helperFuncs.js";
import {PRODUCT_ERROR_CODE} from "@stockhome/shared";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});

export const newProduct = async (
    name: string,
    description: string,
    price: string,
    amount: string,
    storage_location: string,
    expiry_date: string,
    bottling_date: string,
): Promise<boolean | { success: boolean; code: string; data: null; message: string }> => {
    const newPrice = price !== "" ? price : null;

    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES (?, ?, ?, ?, UUID_TO_BIN(?), ?, ?)",
        [name, description, newPrice, amount, storage_location, expiry_date, bottling_date],
    );

    if (result.affectedRows > 0) {
        return {
            success: true,
            code: "SP001",
            data: null,
            message: "New Product successfully created.",
        };
    }

    return returnErrorCode(PRODUCT_ERROR_CODE.PRODUCT_NOT_CREATED);
};

export const productDetails = async (uuid: string) => {
    const [result] = await pool.query<RowDataPacket[]>(
        `SELECT BIN_TO_UUID(p.uuid) AS uuid,
                p.name,
                p.description,
                p.price,
                p.amount,
                BIN_TO_UUID(s.uuid) AS storage_location_uuid,
                s.name              AS storage_location_name,
                p.expiry_date,
                p.bottling_date,
                p.picture
         FROM products p
                  JOIN storage_locations s ON p.storage_location = s.uuid
         WHERE p.uuid = UUID_TO_BIN(?)`,
        [uuid],
    );

    if (result.length > 0) {
        return {
            success: true,
            code: "SP003",
            data: result[0],
            message: "Product details successfully loaded.",
        };
    }

    return returnErrorCode(PRODUCT_ERROR_CODE.PRODUCT_NOT_FOUND);
};

export const allProducts = async () => {
    const [result] = await pool.query<RowDataPacket[]>(`
        SELECT BIN_TO_UUID(p.uuid) AS uuid,
               p.name,
               p.description,
               p.price,
               p.amount,
               BIN_TO_UUID(s.uuid) AS storage_location_uuid,
               s.name              AS storage_location_name,
               p.expiry_date,
               p.bottling_date,
               p.picture,
               p.created_at,
               p.updated_at
        FROM products p
                 JOIN storage_locations s ON p.storage_location = s.uuid
        WHERE p.deleted = 0
    `);

    if (result.length > 0) {
        return {
            success: true,
            code: "SP002",
            data: result,
            message: "All products successfully loaded.",
        };
    }

    return returnErrorCode(PRODUCT_ERROR_CODE.NO_PRODUCTS_FOUND);
};

export const setAmount = async (itemUUID: string, amount: number) => {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE products
         SET amount = ?
         WHERE uuid = UUID_TO_BIN(?)`,
        [amount, itemUUID],
    );

    if (result.affectedRows > 0) {
        return {
            success: true,
            code: "SP004",
            data: null,
            message: "Amount successfully updated.",
        };
    }

    return returnErrorCode(PRODUCT_ERROR_CODE.PRODUCT_AMOUNT_NOT_UPDATED);
};

export const updateItem = async (
    itemUUID: string,
    newValues: {
        name: string;
        description: string;
        price: string;
        amount: string;
        storage_location_uuid: string;
        expiry_date: string;
        bottling_date: string;
    },
) => {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE products
         SET name             = ?,
             description      = ?,
             price            = ?,
             amount           = ?,
             storage_location = UUID_TO_BIN(?),
             expiry_date      = ?,
             bottling_date    = ?
         WHERE uuid = UUID_TO_BIN(?);`,
        [
            newValues.name,
            newValues.description,
            newValues.price,
            newValues.amount,
            newValues.storage_location_uuid,
            newValues.expiry_date,
            newValues.bottling_date,
            itemUUID,
        ],
    );

    if (result.affectedRows > 0) {
        return {
            success: true,
            code: "SP005",
            data: null,
            message: "Item updated successfully.",
        };
    }

    return returnErrorCode(PRODUCT_ERROR_CODE.PRODUCT_NOT_UPDATED);
};

export const deleteProduct = async (uuid: string) => {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE products
         SET deleted = 1
         WHERE uuid = UUID_TO_BIN(?);`,
        [uuid],
    );

    if (result.affectedRows > 0) {
        return {
            success: true,
            code: "SP006",
            data: null,
            message: "Product deleted successfully.",
        };
        ;
    }

    return returnErrorCode(PRODUCT_ERROR_CODE.PRODUCT_NOT_DELETED);
};