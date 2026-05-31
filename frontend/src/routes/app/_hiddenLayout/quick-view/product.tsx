import { createFileRoute } from "@tanstack/react-router";
import { ProductQuickView } from "../../../../pages/ProductQuickView";

export const Route = createFileRoute("/app/_hiddenLayout/quick-view/product")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductQuickView />;
}
