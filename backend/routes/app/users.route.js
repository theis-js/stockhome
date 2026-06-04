import express from "express";
import dotenv from "dotenv";
import { authenticate, generateToken } from "../../services/tokenService.js";
import {
  findUser,
  loginUser,
  updateSettings,
  getSettings,
  changePassword,
} from "./database/users.database.js";
dotenv.config();
const router = express.Router();

router.post("/verify-token", authenticate, async (req, res) => {
  res.sendStatus(200);
});

router.post("/update-app-settings", authenticate, async (req, res) => {
  const appName = req.body.appName;
  const currency = req.body.currency;

  const result = await updateSettings(req.body);

  if (result.code === "su003") {
    res.status(201).json({
      success: true,
      code: "su003",
      data: result.data,
      message: null,
    });
  }

  if (result.code === "eu004") {
    res.status(500).json({
      success: false,
      code: "eu004",
      data: null,
      message: "Unexpected server error",
    });
  }
});

router.get("/settings", authenticate, async (req, res) => {
  const result = await getSettings();

  if (result.code === "su004") {
    res.status(201).json({
      success: true,
      code: "su004",
      data: result.result,
      message: null,
    });
  }

  if (result.code === "eu005") {
    res.status(500).json({
      success: false,
      code: "eu005",
      data: null,
      message: "Unexpected server error",
    });
  }
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

    if (login.code === "eu003") {
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

router.post("/change-password", authenticate, async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const username = req.user.username;

  const result = await changePassword(username, currentPassword, newPassword);

  if (result.code === "su005") {
    res.status(202).json({
      success: true,
      code: result.code,
    });
  }

  if (result.code === "eu006") {
    res.status(406).json({
      success: false,
      code: result.code,
    });
  }
});

export default router;
