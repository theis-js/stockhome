import { createFileRoute } from "@tanstack/react-router";
import { Storages } from "../../../../pages/Storages";

export const Route = createFileRoute("/app/_hiddenLayout/_authed/storages")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Storages />;
}
