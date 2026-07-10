import { createFileRoute } from "@tanstack/react-router";
import { AddProduct } from "../../../../pages/AddProduct";

export const Route = createFileRoute("/app/_hiddenLayout/_authed/add-product")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddProduct />;
}
