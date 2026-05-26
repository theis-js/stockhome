import { API_BASE } from "../config/api.config";
import Cookies from "js-cookie";
import type { TFunction } from "i18next";
import { toast } from "react-toastify";

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
  console.log(response);

  if (result.status === 202) {
    Cookies.set("token", response.data.token);
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
