import express from "express";
import dotenv from "dotenv";
import { authenticate } from "../../services/tokenService.js";
import {
  allProducts,
  newProduct,
  productDetails,
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

router.get("/view", authenticate, async (req, res) => {
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

export default router;
