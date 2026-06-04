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
    return { code: "eu001" }; // username or password is wrong
  }

  if (!result[0].is_active) {
    return { code: "eu002" }; // user is deactivated
  }

  return { code: "su001", data: result[0] }; // user found
};

export const loginUser = async (username) => {
  const [result] = await pool.query(
    "UPDATE users SET last_login = NOW() WHERE username = ?;",
    [username],
  );

  if (result.affectedRows > 0) {
    return { code: "su002" };
  } else {
    return { code: "eu003" };
  }
};

export const updateSettings = async (payload) => {
  const appName = payload["app-name"];
  const currency = payload.currency;

  const [result] = await pool.query(
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
    return { code: "su003" };
  } else {
    return { code: "eu004" };
  }
};

export const getSettings = async () => {
  const [result] = await pool.query(`SELECT * FROM app_settings;`);

  if (result.length > 0) {
    return { code: "su004", result };
  } else {
    return { code: "eu005" };
  }
};

export const changePassword = async (
  username,
  currentPasswordUser,
  newPassword,
) => {
  const [result] = await pool.query(
    `UPDATE users SET password = ? WHERE username = ? AND password = ?;`,
    [newPassword, username, currentPasswordUser],
  );

  if (result.affectedRows > 0) {
    return { code: "su005" };
  } else {
    return { code: "eu006" };
  }
};
