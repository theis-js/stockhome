import express from "express";
import dotenv from "dotenv";
import {authenticate, generateToken} from "../../services/tokenService.js";
import {changePassword, findUser, getSettings, loginUser, updateSettings,} from "./database/users.database.ts";

dotenv.config();
const router = express.Router();

router.post("/verify-token", authenticate, async (req, res) => {
    res.sendStatus(200);
});

router.post("/update-app-settings", authenticate, async (req, res) => {
    const result = await updateSettings(req.body);

    if (result.code === "su003") {
        return res.status(201).json({
            success: true,
            code: "su003",
            data: result.data,
            message: null,
        });
    }

    return res.status(500).json({
        success: false,
        code: result.code,
        data: null,
        message: result.message,
    });
});

router.get("/settings", authenticate, async (req, res) => {
    const result = await getSettings();

    if (result.code === "su004") {
        return res.status(200).json({
            success: true,
            code: "su004",
            data: result.data,
            message: null,
        });
    }

    return res.status(500).json({
        success: false,
        code: result.code,
        data: null,
        message: result.message,
    });
});

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = await findUser(username, password);

    if (result.code === "EU001") {
        return res.status(404).json({
            success: false,
            code: result.code,
            data: null,
            message: result.message,
        });
    }

    if (result.code === "EU002") {
        return res.status(403).json({
            success: false,
            code: result.code,
            data: null,
            message: result.message,
        });
    }

    if (result.code === "su001") {
        const token = await generateToken(result.data);
        const login = await loginUser(result.data.username);

        if (login.code !== "su002") {
            return res.status(500).json({
                success: false,
                code: login.code,
                data: null,
                message: login.message,
            });
        }

        return res.status(202).json({
            success: true,
            code: "su001",
            data: {
                token,
            },
            message: "User token generated successfully",
        });
    }

    return res.status(500).json({
        success: false,
        code: result.code,
        data: null,
        message: result.message,
    });
});

router.post("/change-password", authenticate, async (req, res) => {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const username = req.user.username;

    const result = await changePassword(username, currentPassword, newPassword);

    if (result.code === "su005") {
        return res.status(202).json({
            success: true,
            code: result.code,
        });
    }

    return res.status(500).json({
        success: false,
        code: result.code,
        message: result.message,
    });
});

export default router;
