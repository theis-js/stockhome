import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

export const allStorages = async () => {
  const [result] = await pool.query(
    "SELECT BIN_TO_UUID(uuid) AS uuid, name, description, created_at, updated_at FROM storage_locations;",
  );

  if (result.length > 0) {
    return { code: "ss001", data: result };
  } else {
    return { code: "es001" };
  }
};

export const newStorage = async (name, description) => {
  const [result] = await pool.query(
    "INSERT INTO storage_locations (name, description) VALUES (?, ?)",
    [name, description],
  );

  if (result.affectedRows > 0) {
    return { code: "ss002" };
  } else {
    return { code: "es002" };
  }
};

export const updateStorage = async (uuid, values) => {
  const [result] = await pool.query(
    "UPDATE storage_locations SET name = ?, description = ? WHERE uuid = UUID_TO_BIN(?);",
    [values.name, values.description, uuid],
  );

  if (result.affectedRows > 0) {
    return { code: "ss003" };
  } else {
    return { code: "es003" };
  }
};
