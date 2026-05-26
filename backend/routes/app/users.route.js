import express from "express";
import dotenv from "dotenv";
import { generateToken } from "../../services/tokenService.js";
import { findUser, loginUser } from "./database/users.database.js";
dotenv.config();
const router = express.Router();

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const result = await findUser(username, password);

  if (result.code === "e001") {
    res.status(404).json({
      success: false,
      code: "e001",
      data: null,
      message: "username oder password is wrong",
    });
  }

  if (result.code === "e002") {
    res.status(403).json({
      success: false,
      code: "e002",
      data: null,
      message: "user is deactivated",
    });
  }

  if (result.code === "s001") {
    const token = await generateToken(result.data);
    const login = await loginUser(result.data.username);

    if (login.code === "e003") {
      res.status(500).json({
        success: false,
        code: "e003",
        data: null,
        message: "Unexpected server error. Please contact system admin.",
      });
    }

    res.status(202).json({
      success: true,
      code: "s001",
      data: {
        token,
      },
      message: "User token generated successfully",
    });
  }
});

export default router;
