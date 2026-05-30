import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../../utils/api/auth";
import { Settings } from "../../../pages/Settings";

export const Route = createFileRoute("/app/_hiddenLayout/app-settings")({
  beforeLoad: async () => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Settings />;
}
