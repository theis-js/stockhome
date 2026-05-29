import { API_BASE } from "../config/api.config";
import Cookies from "js-cookie";
import type {
  NewStorage,
  ProductFormValues,
  Storage,
} from "../misc/interfaces";

export const getProducts = async () => {
  const result = await fetch(`${API_BASE}/products/all-products`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token") || ""}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const response = await result.json();

  if (response.code === "ep002") {
    return { success: false, code: response.code };
  }

  if (response.code === "sp002") {
    return response.data;
  }
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

  if (response.code === "ep003") {
    return { success: false, code: response.code };
  }

  if (response.code === "sp003") {
    return response.data;
  }
};

export const toInputDate = (value?: string) => {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
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

  if (response.code === "ep004") {
    return { success: false, code: response.code };
  }

  if (response.code === "sp004") {
    return response.data;
  }
};

export const getStorages = async () => {
  const result = await fetch(`${API_BASE}/storage/all-storages`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token") || ""}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const response = await result.json();

  if (response.code === "es001") {
    return { success: false, code: response.code };
  }

  if (response.code === "ss001") {
    return response.data;
  }
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

  if (response.code === "ep001") {
    return { success: false, code: response.code };
  }

  if (response.code === "sp001") {
    return response.data;
  }
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

  if (response.code === "ep001") {
    return { success: false, code: response.code };
  }

  if (response.code === "sp001") {
    return response.data;
  }
};

export const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString("de-DE");
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

  if (response.code === "es002") {
    return { success: false, code: response.code };
  }

  if (response.code === "ss002") {
    return response.data;
  }
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

  if (response.code === "es004") {
    return { success: false, code: response.code };
  }

  if (response.code === "ss004") {
    return { success: true, code: response.code };
  }
};
