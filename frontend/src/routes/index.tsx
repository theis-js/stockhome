import { isAuthenticated } from "../utils/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: "/login",
      });
    } else {
      throw redirect({
        to: "/app/inventory",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return;
}
