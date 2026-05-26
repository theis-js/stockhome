// routes/app/_layout.tsx (oder app.tsx als Parent)
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_hiddenLayout")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div>
      <h1>Layout</h1>
      <Outlet />
    </div>
  );
}
