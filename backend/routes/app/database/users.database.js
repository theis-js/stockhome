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

export const findUser = async (username, password) => {
  const [result] = await pool.query(
    "SELECT BIN_TO_UUID(uuid) AS uuid, username, first_name, last_name, email, is_admin, is_active, last_login FROM users WHERE username = ? AND password = ?;",
    [username, password],
  );

  if (result.length <= 0) {
    return { code: "e001" }; // username or password is wrong
  }

  if (!result[0].is_active) {
    return { code: "e002" }; // user is deactivated
  }

  return { code: "s001", data: result[0] }; // user found
};

export const loginUser = async (username) => {
  const [result] = await pool.query(
    "UPDATE users SET last_login = NOW() WHERE username = ?;",
    [username],
  );

  if (result.affectedRows > 0) {
    return { code: "s002" };
  } else {
    return { code: "e003" };
  }
};
