import { API_BASE } from "../config/api.config";
import Cookies from "js-cookie";
import type {
  NewStorage,
  ProductFormValues,
  SettingsIntf,
  Storage,
} from "../misc/interfaces";
import i18n from "./i18n";



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

export const mutateSettings = async (payload: SettingsIntf) => {
  const result = await fetch(`${API_BASE}/users/update-app-settings`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${Cookies.get("token") || ""}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const response = await result.json();

  if (response.code === "eu004") {
    return { success: false, code: response.code };
  }

  if (response.code === "su003") {
    return { success: true, code: response.code };
  }
};

export const fetchSettings = async () => {
  const result = await fetch(`${API_BASE}/users/settings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Cookies.get("token") || ""}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const response = await result.json();

  if (response.code === "eu005") {
    return { success: false, code: response.code };
  }

  if (response.code === "su004") {
    return { success: true, data: response.data, code: response.code };
  }
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

  console.log(response);
};

export const changeTranslation = () => {
  const clientLng = i18n.language;

  if (clientLng === "en") {
    i18n.changeLanguage("de");
    Cookies.set("language", "de");
  } else if (clientLng === "de") {
    i18n.changeLanguage("en");
    Cookies.set("language", "en");
  } else {
    alert("Cannot change language.");
  }
};
