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

export const newProduct = async (
  name,
  description,
  price,
  amount,
  storage_location,
  expiry_date,
  bottling_date,
) => {
  const [result] = await pool.query(
    "INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES (?, ?, ?, ?, UUID_TO_BIN(?), ?, ?)",
    [
      name,
      description,
      price,
      amount,
      storage_location,
      expiry_date,
      bottling_date,
    ],
  );

  if (result.affectedRows > 0) {
    return { code: "sp001" }; // success
  } else {
    return { code: "ep001" }; // error
  }
};

export const allProducts = async () => {
  const [result] = await pool.query(`
    SELECT 
  BIN_TO_UUID(p.uuid)            AS uuid,
  p.name,
  p.description,
  p.price,
  p.amount,
  BIN_TO_UUID(s.uuid)            AS storage_location_uuid,
  s.name                         AS storage_location_name,
  p.expiry_date,
  p.bottling_date,
  p.picture,
  p.created_at,
  p.updated_at
  FROM products p
  JOIN storage_locations s ON p.storage_location = s.uuid
  `);

  if (result.length > 0) {
    return { code: "sp002", data: result };
  } else {
    return { code: "ep002" };
  }
};
