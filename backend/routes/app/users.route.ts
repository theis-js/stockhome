import express from "express";
import dotenv from "dotenv";
import { authenticate, generateToken } from "../../services/tokenService";
import {
  changePassword,
  findUser,
  getSettings,
  loginUser,
  updateSettings,
} from "./database/users.database";
import { GENERAL_ERROR_CODE, USER_ERROR_CODE } from "@stockhome/shared";

dotenv.config();
const router = express.Router();

router.post("/verify-token", authenticate, async (req, res) => {
  res.sendStatus(200);
});

router.post("/update-app-settings", authenticate, async (req, res) => {
  const values = req.body;

  if (!values || Object.keys(values).length === 0) {
    return res.status(400).json({
      success: false,
      code: USER_ERROR_CODE.INVALID_REQUEST_BODY[0],
      data: null,
      message: USER_ERROR_CODE.INVALID_REQUEST_BODY[1],
    });
  }

  const result = await updateSettings(values);

  if (!result) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
      data: null,
      message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
  }

  if (result.code === "SU003") {
    return res.status(201).json({
      success: true,
      code: result.code,
      data: result.data,
      message: result.message,
    });
  }

  return res.status(500).json({
    success: false,
    code: result.code || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
    data: null,
    message: result.message || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
  });
});

router.get("/settings", authenticate, async (req, res) => {
  const result = await getSettings();

  if (!result) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
      data: null,
      message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
  }

  if (result.code === "SU004") {
    return res.status(200).json({
      success: true,
      code: result.code,
      data: result.data,
      message: result.message,
    });
  }

  return res.status(500).json({
    success: false,
    code: result.code || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
    data: null,
    message: result.message || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
  });
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      code: USER_ERROR_CODE.INVALID_REQUEST_BODY[0],
      data: null,
      message: USER_ERROR_CODE.INVALID_REQUEST_BODY[1],
    });
  }

  const result = await findUser(username, password);

  if (!result) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
      data: null,
      message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
  }

  if (result.code === USER_ERROR_CODE.WRONG_USERNAME_PASSWORD[0]) {
    return res.status(404).json({
      success: false,
      code: result.code,
      data: null,
      message: result.message,
    });
  }

  if (result.code === USER_ERROR_CODE.USER_IS_DEACTIVATED[0]) {
    return res.status(403).json({
      success: false,
      code: result.code,
      data: null,
      message: result.message,
    });
  }

  if (result.code === "SU001") {
    if (!result.data) {
      return res.status(500).json({
        success: false,
        code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
        data: null,
        message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
      });
    }

    const token = await generateToken(result.data);

    if (!token) {
      return res.status(500).json({
        success: false,
        code: USER_ERROR_CODE.TOKEN_GENERATION_FAILED[0],
        data: null,
        message: USER_ERROR_CODE.TOKEN_GENERATION_FAILED[1],
      });
    }

    if (!result.data) {
      return res.status(500).json({
        success: false,
        code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
        data: null,
        message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
      });
    }

    const login = await loginUser(result.data.username);

    if (!login) {
      return res.status(500).json({
        success: false,
        code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
        data: null,
        message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
      });
    }

    if (login.code !== "SU002") {
      return res.status(500).json({
        success: false,
        code: login.code || USER_ERROR_CODE.LOGIN_FAILED[0],
        data: null,
        message: login.message || USER_ERROR_CODE.LOGIN_FAILED[1],
      });
    }

    return res.status(202).json({
      success: true,
      code: "SU001",
      data: {
        token,
      },
      message: "User token generated successfully",
    });
  }

  return res.status(500).json({
    success: false,
    code: result.code || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
    data: null,
    message: result.message || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
  });
});

router.post("/change-password", authenticate, async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  if (!req.user) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
      data: null,
      message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
  }

  const username = req.user.username;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      code: USER_ERROR_CODE.INVALID_REQUEST_BODY[0],
      data: null,
      message: USER_ERROR_CODE.INVALID_REQUEST_BODY[1],
    });
  }

  const result = await changePassword(username, currentPassword, newPassword);

  if (!result) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
      data: null,
      message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
  }

  if (result.code === "SU005") {
    return res.status(202).json({
      success: true,
      code: result.code,
      data: null,
      message: result.message,
    });
  }

  return res.status(500).json({
    success: false,
    code: result.code || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
    data: null,
    message: result.message || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
  });
});

export default router;
