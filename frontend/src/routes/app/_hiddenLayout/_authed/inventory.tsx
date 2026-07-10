import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage } from "../../../../pages/Inventory";

export const Route = createFileRoute("/app/_hiddenLayout/_authed/inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  return <InventoryPage />;
}
