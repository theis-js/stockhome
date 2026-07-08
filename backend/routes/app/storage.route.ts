import express from "express";
import dotenv from "dotenv";
import {authenticate} from "../../services/tokenService.js";
import {allStorages, deleteStorage, newStorage, updateStorage,} from "./database/storage.database.ts";
import {STORAGE_ERROR_CODE} from "@stockhome/shared";

dotenv.config();
const router = express.Router();

router.get("/all-storages", authenticate, async (req, res) => {
  const result = await allStorages();

  if (result.code === "ss001") {
    return res.status(200).json({
      success: true,
      code: "ss001",
      data: result.data,
      message: "",
    });
  }

  if (result.code === STORAGE_ERROR_CODE.NO_STORAGE_LOCATIONS_FOUND[0]) {
    return res.status(404).json({
      success: false,
      code: result.code,
      data: null,
      message: result.message,
    });
  }

  return res.status(500).json({
      success: false,
      code: result.code,
      data: null,
      message: result.message,
    });
});

router.post("/new-storage", authenticate, async (req, res) => {
  const { name, description } = req.body;

  let desc = description;

  if (!name) {
    return res.status(400).json({
      success: false,
      code: STORAGE_ERROR_CODE.INVALID_REQUEST_BODY[0],
      data: null,
      message: "invalid request body",
    });
  }

  if (description == "") {
    desc = null;
  }

  const result = await newStorage(name, desc);

  if (result.code === "ss002") {
    return res.status(201).json({
      success: true,
      code: "ss002",
      data: null,
      message: "",
    });
  }

  return res.status(500).json({
      success: false,
      code: result.code,
      data: null,
      message: result.message,
    });
});

router.post("/update-storage", authenticate, async (req, res) => {
  const storageUUID = req.query.storageUUID;
  const values = req.body;

  const result = await updateStorage(storageUUID, values);

  if (result.code === "ss003") {
    return res.status(201).json({
      success: true,
      code: "ss003",
      data: null,
      message: "",
    });
  }

  return res.status(500).json({
      success: false,
      code: result.code,
      data: null,
      message: result.message,
    });
});

router.delete("/delete", authenticate, async (req, res) => {
  const uuid = req.query.uuid;

  const result = await deleteStorage(uuid);

  if (result.code === "ss004") {
    return res.status(201).json({
      success: true,
      code: "ss004",
      data: null,
      message: "",
    });
  }

  return res.status(500).json({
      success: false,
      code: result.code,
      data: null,
      message: result.message,
    });
});

export default router;
