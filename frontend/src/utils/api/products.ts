import {API_BASE} from "../../config/api.config";
import Cookies from "js-cookie";
import type {ProductFormValues} from "../../misc/interfaces";
import {createApiError} from "./apiError";

export const getProducts = async () => {
    const result = await fetch(`${API_BASE}/products/all-products`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token") || ""}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    const response = await result.json();

    if (response.code === "SP002") {
        return response.data;
    }

    throw createApiError(response.code, "Get products failed");
};

export const getProductDetails = async (uuid: string) => {
    const result = await fetch(`${API_BASE}/products/view?uuid=${uuid}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token") || ""}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const response = await result.json();

    if (response.code === "SP003") {
        return response.data;
    }

    throw createApiError(response.code, "Get product details failed");
};

export const mutateProduct = async (
    values: ProductFormValues,
    itemUUID: string,
) => {
    const payload = {
        ...values,
        expiry_date: values.expiry_date || null,
        bottling_date: values.bottling_date || null,
    };

    const result = await fetch(
        `${API_BASE}/products/mutate/update-item?item=${itemUUID}`,
        {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                Authorization: `Bearer ${Cookies.get("token") || ""}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        },
    );

    const response = await result.json();

    if (response.code === "SP005") {
        return response.data;
    }

    throw createApiError(response.code, "Update product failed");
};

export const deleteSelectedProducts = async (uuids: string[]) => {
    const result = await fetch(`${API_BASE}/products/delete-selection`, {
        method: "POST",
        body: JSON.stringify(uuids),
        headers: {
            Authorization: `Bearer ${Cookies.get("token") || ""}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const response = await result.json();

    if (response.code === "SP006") {
        return {success: true};
    }

    throw createApiError(response.code, "Delete products failed");
};

export const createProduct = async (values: ProductFormValues) => {
    const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        amount: values.amount,
        storage_location: values.storage_location_uuid,
        expiry_date: values.expiry_date || null,
        bottling_date: values.bottling_date || null,
    };

    const result = await fetch(`${API_BASE}/products/new-product`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            Authorization: `Bearer ${Cookies.get("token") || ""}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const response = await result.json();

    if (response.code === "SP001") {
        return response.data;
    }

    throw createApiError(response.code, "Create product failed");
};
