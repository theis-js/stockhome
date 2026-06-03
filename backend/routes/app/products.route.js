import express from "express";
import dotenv from "dotenv";
import { authenticate } from "../../services/tokenService.js";
import {
  allProducts,
  deleteProduct,
  newProduct,
  productDetails,
  setAmount,
  updateItem,
} from "./database/products.database.js";
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

  if (result.code === "ep001") {
    res.status(406).json({
      success: false,
      code: "ep001",
      data: null,
      message: "Error while creating product",
    });
  }

  if (result.code === "sp001") {
    res.status(201).json({
      success: true,
      code: "sp001",
      data: null,
      message: "",
    });
  }
});

router.get("/all-products", authenticate, async (req, res) => {
  const result = await allProducts();

  if (result.code === "ep002") {
    res.status(406).json({
      success: false,
      code: "ep002",
      data: null,
      message: "Error while fetching products",
    });
  }

  if (result.code === "sp002") {
    res.status(200).json({
      success: true,
      code: "sp002",
      data: result.data,
      message: "",
    });
  }
});

router.get("/view", async (req, res) => {
  const uuid = req.query.uuid;

  const result = await productDetails(uuid);

  if (result.code === "ep003") {
    res.status(406).json({
      success: false,
      code: "ep003",
      data: null,
      message: "Error while fetching product",
    });
  }

  if (result.code === "sp003") {
    res.status(200).json({
      success: true,
      code: "sp003",
      data: result.data,
      message: "",
    });
  }
});

router.put("/mutate/set-amount", authenticate, async (req, res) => {
  const amount = req.query.amount;
  const itemUUID = req.query.item;

  const result = await setAmount(itemUUID, amount);

  if (result.code === "ep004") {
    res.status(406).json({
      success: false,
      code: "ep004",
      data: null,
      message: "Error while updating product amount",
    });
  }

  if (result.code === "sp004") {
    res.status(200).json({
      success: true,
      code: "sp004",
      data: null,
      message: "",
    });
  }
});

router.post("/mutate/update-item", async (req, res) => {
  const itemUUID = req.query.item;
  const newValues = req.body;

  const result = await updateItem(itemUUID, newValues);

  if (result.code === "ep005") {
    res.status(406).json({
      success: false,
      code: "ep005",
      data: null,
      message: "Error while updating product",
    });
  }

  if (result.code === "sp005") {
    res.status(200).json({
      success: true,
      code: "sp005",
      data: null,
      message: "",
    });
  }
});

router.post("/delete-selection", authenticate, async (req, res) => {
  let isError = false;
  const uuidArray = req.body;

  for (const uuid of uuidArray) {
    const response = await deleteProduct(uuid);
    if (response.code === "ep006" || !response) {
      isError = true;
      break;
    }
  }

  if (isError === false) {
    res.status(202).json({
      success: true,
      code: "sp006",
      data: null,
      message: "",
    });
  } else {
    res.status(500).json({
      success: false,
      code: "ep006",
      data: null,
      message: "",
    });
  }
});

export default router;
