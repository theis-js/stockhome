import { API_BASE } from "../../config/api.config";
import Cookies from "js-cookie";
import type { NewStorage, Storage } from "../../misc/interfaces";

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
