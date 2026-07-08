import express from "express";
import dotenv from "dotenv";
import { authenticate } from "../../services/tokenService";
import {
  allStorages,
  deleteStorage,
  newStorage,
  updateStorage,
} from "./database/storage.database";
import { GENERAL_ERROR_CODE, STORAGE_ERROR_CODE } from "@stockhome/shared";

dotenv.config();
const router = express.Router();

router.get("/all-storages", authenticate, async (req, res) => {
  const result = await allStorages();

  if (!result) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR,
      data: null,
      message: "Unknown error",
    });
  }

  if (result.code === "SS001") {
    return res.status(200).json({
      success: true,
      code: result.code,
      data: result.data,
      message: result.message,
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
    code: result.code || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
    data: null,
    message: result.message || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
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
      message: STORAGE_ERROR_CODE.INVALID_REQUEST_BODY[1],
    });
  }

  if (description == "") {
    desc = null;
  }

  const result = await newStorage(name, desc);

  if (!result) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
      data: null,
      message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
    });
  }

  if (result.code === "SS002") {
    return res.status(201).json({
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

router.post("/update-storage", authenticate, async (req, res) => {
  const storageUUID = req.query.storageUUID;
  const values = req.body;

  if (!storageUUID || !values) {
    return res.status(400).json({
      success: false,
      code: STORAGE_ERROR_CODE.INVALID_PARAMETERS[0],
      data: null,
      message: STORAGE_ERROR_CODE.INVALID_PARAMETERS[1],
    });
  }

  if (typeof storageUUID !== "string") {
    return res.status(400).json({
      success: false,
      code: STORAGE_ERROR_CODE.INVALID_PARAMETERS[0],
      data: null,
      message: STORAGE_ERROR_CODE.INVALID_PARAMETERS[1],
    });
  }

  const result = await updateStorage(storageUUID, values);

  if (!result) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
      data: null,
      message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
  }

  if (result.code === "SS003") {
    return res.status(201).json({
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

router.delete("/delete", authenticate, async (req, res) => {
  const uuid = req.query.uuid;

  if (typeof uuid !== "string") {
    return res.status(400).json({
      success: false,
      code: STORAGE_ERROR_CODE.INVALID_PARAMETERS[0],
      data: null,
      message: STORAGE_ERROR_CODE.INVALID_PARAMETERS[1],
    });
  }

  const result = await deleteStorage(uuid);

  if (!result) {
    return res.status(500).json({
      success: false,
      code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
      data: null,
      message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
  }

  if (result.code === "SS004") {
    return res.status(201).json({
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
