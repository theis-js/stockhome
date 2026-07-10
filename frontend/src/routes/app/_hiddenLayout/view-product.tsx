import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { verifyLogin } from "../../../utils/api/auth";
import { ViewProduct } from "../../../pages/ViewProduct";

export const Route = createFileRoute("/app/_hiddenLayout/view-product")({
  beforeLoad: async () => {
    await verifyLogin();
  },
  validateSearch: z.object({
    product: z.string(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { product } = Route.useSearch();
  return <ViewProduct uuid={product} />;
}
