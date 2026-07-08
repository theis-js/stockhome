import {API_BASE} from "../../config/api.config";
import Cookies from "js-cookie";
import type {NewStorage, Storage} from "../../misc/interfaces";
import {createApiError} from "./apiError";

export const getStorages = async () => {
    const result = await fetch(`${API_BASE}/storage/all-storages`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token") || ""}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const response = await result.json();

    if (response.code === "SS001") {
        return response.data;
    }

    throw createApiError(response.code, "Get storages failed");
};

export const mutateNewStorage = async (values: NewStorage) => {
    const result = await fetch(`${API_BASE}/storage/new-storage`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
            Authorization: `Bearer ${Cookies.get("token") || ""}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const response = await result.json();

    if (response.code === "SS002") {
        return response.data;
    }

    throw createApiError(response.code, "Create storage failed");
};

export const updateStorage = async (
    uuid: string,
    values: Pick<Storage, "name" | "description">,
) => {
    const result = await fetch(
        `${API_BASE}/storage/update-storage?storageUUID=${uuid}`,
        {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                Authorization: `Bearer ${Cookies.get("token") || ""}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        },
    );

    const response = await result.json();

    if (response.code === "ss003") {
        return response.data;
    }

    throw createApiError(response.code, "Update storage failed");
};

export const deleteStorage = async (uuid: string) => {
    const result = await fetch(`${API_BASE}/storage/delete?uuid=${uuid}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${Cookies.get("token") || ""}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const response = await result.json();

    if (response.code === "SS004") {
        return {success: true, code: response.code};
    }

    throw createApiError(response.code, "Delete storage failed");
};
