import { API_BASE } from "../config/api.config";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { redirect } from "@tanstack/react-router";

const { t } = useTranslation();

export async function isAuthenticated() {
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

  return false;
}

export async function signInUser(username: string, password: string) {
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
    Cookies.set("token", response.token);
    return true;
  }

  if (result.status !== 202) {
    Cookies.remove("token");
    toast.error(t(response.code));
  }
}

export function signOutUser() {
  Cookies.remove("token");
  throw redirect({
    to: "/login",
  });
}
