import { createFileRoute } from "@tanstack/react-router";
import { LoginCard } from "../components/LoginCard";
import { checkLogin } from "../utils/api/auth.ts";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    await checkLogin();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LoginCard />
    </>
  );
}
