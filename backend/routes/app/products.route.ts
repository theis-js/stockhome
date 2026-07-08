import express from "express";
import dotenv from "dotenv";
import {authenticate} from "../../services/tokenService.js";
import {
  allProducts,
  deleteProduct,
  newProduct,
  productDetails,
  setAmount,
  updateItem,
} from "./database/products.database.ts";
import {PRODUCT_ERROR_CODE} from "@stockhome/shared";

dotenv.config();
const router = express.Router();

router.post("/new-product", authenticate, async (req, res) => {
  const {
    name,
    description,
    price,
    amount,
    storage_location,
    expiry_date,
    bottling_date,
  } = req.body;

  const result = await newProduct(
    name,
    description,
    price,
    amount,
    storage_location,
    expiry_date,
    bottling_date,
  );

  if (result.code === "sp001") {
    return res.status(201).json({
      success: true,
      code: "sp001",
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

router.get("/all-products", authenticate, async (req, res) => {
  const result = await allProducts();

  if (result.code === "sp002") {
    return res.status(200).json({
      success: true,
      code: "sp002",
      data: result.data,
      message: "",
    });
  }

  if (result.code === PRODUCT_ERROR_CODE.NO_PRODUCTS_FOUND[0]) {
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

router.get("/view", async (req, res) => {
  const uuid = req.query.uuid;

  const result = await productDetails(uuid);

  if (result.code === "sp003") {
    return res.status(200).json({
      success: true,
      code: "sp003",
      data: result.data,
      message: "",
    });
  }

  if (result.code === PRODUCT_ERROR_CODE.PRODUCT_NOT_FOUND[0]) {
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

router.put("/mutate/set-amount", authenticate, async (req, res) => {
  const amount = req.query.amount;
  const itemUUID = req.query.item;

  const result = await setAmount(itemUUID, amount);

  if (result.code === "sp004") {
    return res.status(200).json({
      success: true,
      code: "sp004",
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

router.post("/mutate/update-item", async (req, res) => {
  const itemUUID = req.query.item;
  const newValues = req.body;

  const result = await updateItem(itemUUID, newValues);

  if (result.code === "sp005") {
    return res.status(200).json({
      success: true,
      code: "sp005",
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

router.post("/delete-selection", authenticate, async (req, res) => {
  let isError = false;
  const uuidArray = req.body;

  for (const uuid of uuidArray) {
    const response = await deleteProduct(uuid);
    if (!response || response.code !== "sp006") {
      isError = true;
      break;
    }
  }

  if (isError === false) {
    return res.status(202).json({
      success: true,
      code: "sp006",
      data: null,
      message: "",
    });
  }

  return res.status(500).json({
    success: false,
    code: PRODUCT_ERROR_CODE.PRODUCT_NOT_DELETED[0],
    data: null,
    message: PRODUCT_ERROR_CODE.PRODUCT_NOT_DELETED[1],
  });
});

export default router;
