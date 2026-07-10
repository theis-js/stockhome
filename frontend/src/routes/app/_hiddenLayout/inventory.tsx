import { createFileRoute } from "@tanstack/react-router";
import { verifyLogin } from "../../../utils/api/auth";
import { InventoryPage } from "../../../pages/Inventory";

export const Route = createFileRoute("/app/_hiddenLayout/inventory")({
  beforeLoad: async () => {
    await verifyLogin();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <InventoryPage />;
}
