import { API_BASE } from "../../config/api.config";
import Cookies from "js-cookie";
import type { SettingsIntf } from "../../misc/interfaces";

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
