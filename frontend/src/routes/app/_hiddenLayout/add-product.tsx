import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../../utils/auth";

export const Route = createFileRoute("/app/_hiddenLayout/add-product")({
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
  return <div>Hello "/app/add-product"!</div>;
}
