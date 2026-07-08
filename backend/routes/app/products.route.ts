import express from "express";
import dotenv from "dotenv";
import {authenticate} from "../../services/tokenService.ts";
import {
  allProducts,
  deleteProduct,
  newProduct,
  productDetails,
  setAmount,
  updateItem,
} from "./database/products.database.ts";
import {GENERAL_ERROR_CODE, PRODUCT_ERROR_CODE} from "@stockhome/shared";

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

    if (!name) {
        return res.status(400).json({
            success: false,
            code: PRODUCT_ERROR_CODE.INVALID_REQUEST_BODY[0],
            data: null,
            message: PRODUCT_ERROR_CODE.INVALID_REQUEST_BODY[1],
        });
    }

    const result = await newProduct(
        name,
        description,
        price,
        amount,
        storage_location,
        expiry_date,
        bottling_date,
    );

    if (!result || typeof result !== "object") {
        return res.status(500).json({
            success: false,
            code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
            data: null,
            message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
        });
    }

    if (result.code === "SP001") {
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

router.get("/all-products", authenticate, async (req, res) => {
    const result = await allProducts();

    if (!result) {
        return res.status(500).json({
            success: false,
            code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
            data: null,
            message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
        });
    }

    if (result.code === "SP002") {
        return res.status(200).json({
            success: true,
            code: result.code,
            data: result.data,
            message: result.message,
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
        code: result.code || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
        data: null,
        message: result.message || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
});

router.get("/view", async (req, res) => {
    const uuid = req.query.uuid;

    if (typeof uuid !== "string") {
        return res.status(400).json({
            success: false,
            code: PRODUCT_ERROR_CODE.INVALID_PARAMETERS[0],
            data: null,
            message: PRODUCT_ERROR_CODE.INVALID_PARAMETERS[1],
        });
    }

    const result = await productDetails(uuid);

    if (!result) {
        return res.status(500).json({
            success: false,
            code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
            data: null,
            message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
        });
    }

    if (result.code === "SP003") {
        return res.status(200).json({
            success: true,
            code: result.code,
            data: result.data,
            message: result.message,
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
        code: result.code || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
        data: null,
        message: result.message || GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
    });
});

router.put("/mutate/set-amount", authenticate, async (req, res) => {
    const amount = req.query.amount;
    const itemUUID = req.query.item;

    if (typeof itemUUID !== "string" || typeof amount !== "number") {
        return res.status(400).json({
            success: false,
            code: PRODUCT_ERROR_CODE.INVALID_PARAMETERS[0],
            data: null,
            message: PRODUCT_ERROR_CODE.INVALID_PARAMETERS[1],
        });
    }

    const result = await setAmount(itemUUID, amount);

    if (!result) {
        return res.status(500).json({
            success: false,
            code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
            data: null,
            message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
        });
    }

    if (result.code === "SP004") {
        return res.status(200).json({
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

router.post("/mutate/update-item", authenticate, async (req, res) => {
    const itemUUID = req.query.item;
    const newValues = req.body;

    if (typeof itemUUID !== "string" || !newValues) {
        return res.status(400).json({
            success: false,
            code: PRODUCT_ERROR_CODE.INVALID_PARAMETERS[0],
            data: null,
            message: PRODUCT_ERROR_CODE.INVALID_PARAMETERS[1],
        });
    }

    const result = await updateItem(itemUUID, newValues);

    if (!result) {
        return res.status(500).json({
            success: false,
            code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
            data: null,
            message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
        });
    }

    if (result.code === "SP005") {
        return res.status(200).json({
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

router.post("/delete-selection", authenticate, async (req, res) => {
    const uuidArray = req.body;

    if (!Array.isArray(uuidArray) || uuidArray.length === 0) {
        return res.status(400).json({
            success: false,
            code: PRODUCT_ERROR_CODE.INVALID_REQUEST_BODY[0],
            data: null,
            message: PRODUCT_ERROR_CODE.INVALID_REQUEST_BODY[1],
        });
    }

    for (const uuid of uuidArray) {
        const response = await deleteProduct(uuid);

        if (!response) {
            return res.status(500).json({
                success: false,
                code: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[0],
                data: null,
                message: GENERAL_ERROR_CODE.UNEXPECTED_SERVER_ERROR[1],
            });
        }

        if (response.code !== "SP006") {
            return res.status(500).json({
                success: false,
                code: response.code || PRODUCT_ERROR_CODE.PRODUCT_NOT_DELETED[0],
                data: null,
                message: response.message || PRODUCT_ERROR_CODE.PRODUCT_NOT_DELETED[1],
            });
        }
    }

    return res.status(202).json({
        success: true,
        code: "SP006",
        data: null,
        message: "All selected products deleted successfully.",
    });
});

export default router;