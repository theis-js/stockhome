import { createFileRoute } from "@tanstack/react-router";
import { verifyLogin } from "../../../utils/api/auth";
import { Settings } from "../../../pages/Settings";

export const Route = createFileRoute("/app/_hiddenLayout/app-settings")({
  beforeLoad: async () => {
    await verifyLogin();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Settings />;
}
