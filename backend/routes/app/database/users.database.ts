import mysql, {type ResultSetHeader, type RowDataPacket} from "mysql2/promise";
import dotenv from "dotenv";
import {GENERAL_ERROR_CODE, USER_ERROR_CODE} from "@stockhome/shared";
import {returnErrorCode} from "../../../services/helperFuncs.js";
import type { AuthTokenPayload } from "../../../services/tokenService";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});

export const findUser = async (username: string, password: string) => {
    const [result] = await pool.query<RowDataPacket[]>(
        "SELECT BIN_TO_UUID(uuid) AS uuid, username, first_name, last_name, email, is_admin, is_active, last_login FROM users WHERE username = ? AND password = ?;",
        [username, password],
    );

    const userRow = result[0];

    if (!userRow) {
        return returnErrorCode(USER_ERROR_CODE.WRONG_USERNAME_PASSWORD);
    }

    // Cast DB row to AuthTokenPayload for token generation / typing
    const user = userRow as unknown as AuthTokenPayload;

    if (!user.is_active) {
        return returnErrorCode(USER_ERROR_CODE.USER_IS_DEACTIVATED);
    }

    return {
        success: true,
        code: "SU001",
        data: user,
        message: "Successfully found user.",
    };
};

export const loginUser = async (username: string) => {
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE users SET last_login = NOW() WHERE username = ?;",
        [username],
    );

    if (result.affectedRows > 0) {
        return {
            success: true,
            code: "SU002",
            data: null,
            message: "Successfully logged in user.",
        };
    } else {
        return returnErrorCode(GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR);
    }
};

export const updateSettings = async (payload: {
    "app-name": string;
    currency: string;
}) => {
    const appName = payload["app-name"];
    const currency = payload.currency;

    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE app_settings
         SET value = CASE name
                         WHEN "app-name" THEN ?
                         WHEN "currency" THEN ?
                         ELSE value
             END
         WHERE name IN ("app-name", "currency");`,
        [appName, currency],
    );

    if (result.affectedRows > 0) {
        return {
            success: true,
            code: "SU003",
            data: null,
            message: "Successfully updated settings.",
        };
    } else {
        return returnErrorCode(GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR);
    }
};

export const getSettings = async () => {
    const [result] = await pool.query<RowDataPacket[]>(
        `SELECT *
         FROM app_settings;`,
    );

    if (result.length > 0) {
        return {
            success: true,
            code: "SU004",
            data: result,
            message: "Successfully fetched settings.",
        };
    } else {
        return returnErrorCode(GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR);
    }
};

export const changePassword = async (
    username: string,
    currentPasswordUser: string,
    newPassword: string,
) => {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE users
         SET password = ?
         WHERE username = ?
           AND password = ?;`,
        [newPassword, username, currentPasswordUser],
    );

    if (result.affectedRows > 0) {
        return {
            success: true,
            code: "SU005",
            data: null,
            message: "Successfully fetched settings.",
        };
    } else {
        return returnErrorCode(GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR);
    }
};