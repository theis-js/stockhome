import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../../utils/auth";
import { InventoryPage } from "../../../pages/Inventory";

export const Route = createFileRoute("/app/_hiddenLayout/inventory")({
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
  return <InventoryPage />;
}
