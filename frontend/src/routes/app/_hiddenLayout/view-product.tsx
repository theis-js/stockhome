import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { isAuthenticated } from "../../../utils/auth";
import { ViewProduct } from "../../../pages/ViewProduct";

export const Route = createFileRoute("/app/_hiddenLayout/view-product")({
  beforeLoad: async () => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: "/login",
      });
    }
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
