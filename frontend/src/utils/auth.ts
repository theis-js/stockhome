import { API_BASE } from "../config/api.config";
import Cookies from "js-cookie";
import type { TFunction } from "i18next";
import { toast } from "react-toastify";
import { fetchSettings } from "./uxFncs";

export async function isAuthenticated() {
  if (Cookies.get("token")) {
    const result = await fetch(`${API_BASE}/users/verify-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token") || ""}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (result.status === 200) {
      return true;
    }
  }

  Cookies.remove("token");
  return false;
}

export async function signInUser(
  username: string,
  password: string,
  t: TFunction,
) {
  const result = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Cookies.get("token") || ""}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const response = await result.json();

  if (result.status === 202) {
    Cookies.set("token", response.data.token);

    const settings = await fetchSettings();
    Cookies.set("app-name", settings?.data[0].value);
    Cookies.set("currency", settings?.data[1].value);

    return { ok: true as const };
  }

  Cookies.remove("token");
  toast.error(t(response.code));
  return { ok: false as const };
}

export function signOutUser() {
  Cookies.remove("token");
  return { ok: true as const };
}
