import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../utils/auth";

export const Route = createFileRoute("/app/inventory")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/inventory"!</div>;
}
