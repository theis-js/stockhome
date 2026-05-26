import express from "express";
import dotenv from "dotenv";
import { authenticate, generateToken } from "../../services/tokenService.js";
import { findUser, loginUser } from "./database/users.database.js";
dotenv.config();
const router = express.Router();

router.post("/verify-token", authenticate, async (req, res) => {
  res.status(200);
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const result = await findUser(username, password);

  if (result.code === "eu001") {
    res.status(404).json({
      success: false,
      code: "eu001",
      data: null,
      message: "username oder password is wrong",
    });
  }

  if (result.code === "eu002") {
    res.status(403).json({
      success: false,
      code: "eu002",
      data: null,
      message: "user is deactivated",
    });
  }

  if (result.code === "su001") {
    const token = await generateToken(result.data);
    const login = await loginUser(result.data.username);

    if (login.code === "e003") {
      res.status(500).json({
        success: false,
        code: "eu003",
        data: null,
        message: "Unexpected server error. Please contact system admin.",
      });
    }

    res.status(202).json({
      success: true,
      code: "su001",
      data: {
        token,
      },
      message: "User token generated successfully",
    });
  }
});

export default router;
