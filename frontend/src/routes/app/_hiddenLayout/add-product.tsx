import { createFileRoute } from "@tanstack/react-router";
import { verifyLogin } from "../../../utils/api/auth";
import { AddProduct } from "../../../pages/AddProduct";

export const Route = createFileRoute("/app/_hiddenLayout/add-product")({
  beforeLoad: async () => {
    await verifyLogin();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <AddProduct />;
}
