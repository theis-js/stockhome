import Cookies from "js-cookie";
import { useNavigate } from "@tanstack/react-router";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    console.log("LOGOUT");
    Cookies.remove("token");
    void navigate({ to: "/login", search: { loggedOut: true } });
  };

  return { logout };
};
