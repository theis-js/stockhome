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
  let newPrice;
  if (price == "") {
    newPrice = null;
  } else {
    newPrice = price;
  }

  const [result] = await pool.query(
    "INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES (?, ?, ?, ?, UUID_TO_BIN(?), ?, ?)",
    [
      name,
      description,
      newPrice,
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

export const productDetails = async (uuid) => {
  const [result] = await pool.query(
    `SELECT 
      BIN_TO_UUID(p.uuid)         AS uuid,
      p.name,
      p.description,
      p.price,
      p.amount,
      BIN_TO_UUID(s.uuid)         AS storage_location_uuid,
      s.name                      AS storage_location_name,
      p.expiry_date,
      p.bottling_date,
      p.picture
     FROM products p
     JOIN storage_locations s ON p.storage_location = s.uuid
     WHERE p.uuid = UUID_TO_BIN(?)`,
    [uuid],
  );

  if (result.length > 0) {
    return { code: "sp003", data: result[0] };
  } else {
    return { code: "ep003" };
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
  WHERE p.deleted = 0
  `);

  if (result.length > 0) {
    return { code: "sp002", data: result };
  } else {
    return { code: "ep002" };
  }
};

export const setAmount = async (itemUUID, amount) => {
  const [result] = await pool.query(
    `
    UPDATE products SET amount = ? WHERE uuid = UUID_TO_BIN(?)
    `,
    [amount, itemUUID],
  );

  if (result.affectedRows > 0) {
    return { code: "sp004" }; // success
  } else {
    return { code: "ep004" }; // error
  }
};

export const updateItem = async (itemUUID, newValues) => {
  const [result] = await pool.query(
    `
    UPDATE products SET name = ?, description = ?, price = ?, amount = ?, storage_location = UUID_TO_BIN(?), expiry_date = ?, bottling_date = ? WHERE uuid = UUID_TO_BIN(?);
    `,
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
    return { code: "sp005" }; // success
  } else {
    return { code: "ep005" }; // error
  }
};

export const deleteProduct = async (uuid) => {
  const [result] = await pool.query(
    `UPDATE products SET deleted = 1 WHERE uuid = UUID_TO_BIN(?);`,
    [uuid],
  );

  if (result.affectedRows > 0) {
    return { code: "sp006" }; // success
  } else {
    return { code: "ep006" }; // error
  }
};
