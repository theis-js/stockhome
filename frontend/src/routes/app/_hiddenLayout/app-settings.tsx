import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "../../../pages/Settings";

export const Route = createFileRoute("/app/_hiddenLayout/app-settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Settings />;
}
