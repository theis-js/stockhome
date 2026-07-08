import mysql, {
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";
import dotenv from "dotenv";
import { STORAGE_ERROR_CODE } from "@stockhome/shared";
import { returnErrorCode } from "../../../services/helperFuncs.js";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

export const allStorages = async () => {
  const [result] = await pool.query<RowDataPacket[]>(
    "SELECT BIN_TO_UUID(uuid) AS uuid, name, description, created_at, updated_at FROM storage_locations;",
  );

  if (result.length > 0) {
    return {
      success: true,
      code: "SS001",
      data: result,
      message: "Successfully fetched all storage locations.",
    };
  }

  return returnErrorCode(STORAGE_ERROR_CODE.NO_STORAGE_LOCATIONS_FOUND);
};

export const newStorage = async (name: string, description: string) => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO storage_locations (name, description) VALUES (?, ?)",
    [name, description],
  );

  if (result.affectedRows > 0) {
    return {
      success: true,
      code: "SS002",
      data: null,
      message: "Successfully created new storage location.",
    };
  }

  return returnErrorCode(STORAGE_ERROR_CODE.STORAGE_NOT_CREATED);
};

export const updateStorage = async (
  uuid: string,
  values: { name: string; description: string },
) => {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE storage_locations SET name = ?, description = ? WHERE uuid = UUID_TO_BIN(?);",
    [values.name, values.description, uuid],
  );

  if (result.affectedRows > 0) {
    return {
      success: true,
      code: "SS003",
      data: null,
      message: "Successfully updated storage location.",
    };
  }

  return returnErrorCode(STORAGE_ERROR_CODE.STORAGE_NOT_UPDATED);
};

export const deleteStorage = async (uuid: string) => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM storage_locations WHERE uuid = UUID_TO_BIN(?);",
    [uuid],
  );

  if (result.affectedRows > 0) {
    return {
      success: true,
      code: "SS004",
      data: null,
      message: "Successfully deleted storage location.",
    };
  }

  return returnErrorCode(STORAGE_ERROR_CODE.STORAGE_NOT_DELETED);
};
