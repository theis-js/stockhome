import { API_BASE } from "../config/api.config";
import Cookies from "js-cookie";

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

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
