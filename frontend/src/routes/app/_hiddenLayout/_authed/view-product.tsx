import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ViewProduct } from "../../../../pages/ViewProduct";

export const Route = createFileRoute("/app/_hiddenLayout/_authed/view-product")(
  {
    validateSearch: z.object({
      product: z.string(),
    }),
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { product } = Route.useSearch();
  return <ViewProduct uuid={product} />;
}
