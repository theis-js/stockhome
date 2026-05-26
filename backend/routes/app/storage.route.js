import express from "express";
import dotenv from "dotenv";
import { authenticate } from "../../services/tokenService.js";
import { allStorages, newStorage } from "./database/storage.database.js";
dotenv.config();
const router = express.Router();

router.get("/all-storages", authenticate, async (req, res) => {
  const result = await allStorages();

  if (result.code === "es001") {
    res.status(500).json({
      success: false,
      code: "es001",
      data: null,
      message: "unexpected server error",
    });
  }

  if (result.code === "ss001") {
    res.status(200).json({
      success: true,
      code: "ss001",
      data: result.data,
      message: "",
    });
  }
});

router.post("/new-storage", authenticate, async (req, res) => {
  const { name, description } = req.body;

  const result = await newStorage(name, description);

  if (result.code === "es002") {
    res.status(500).json({
      success: false,
      code: "es002",
      data: null,
      message: "unexpected server error",
    });
  }

  if (result.code === "ss002") {
    res.status(201).json({
      success: true,
      code: "ss002",
      data: null,
      message: "",
    });
  }
});

export default router;
