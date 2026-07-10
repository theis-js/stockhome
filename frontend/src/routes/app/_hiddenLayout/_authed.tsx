import { createFileRoute, Outlet } from "@tanstack/react-router";
import { verifyLogin } from "../../../utils/api/auth";

export const Route = createFileRoute("/app/_hiddenLayout/_authed")({
  beforeLoad: async () => {
    await verifyLogin();
  },
  component: () => <Outlet />,
});
