import { createFileRoute } from "@tanstack/react-router";
import { verifyLogin } from "../../../utils/api/auth";
import { Storages } from "../../../pages/Storages";

export const Route = createFileRoute("/app/_hiddenLayout/storages")({
  beforeLoad: async () => {
    await verifyLogin();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Storages />;
}
