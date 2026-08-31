import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "../../components/Sidebar";

export const Route = createFileRoute("/app/_hiddenLayout")({
  component: AppLayout,
});

function AppLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div
      className="flex min-h-screen w-full flex-col lg:flex-row"
      style={{ backgroundColor: "var(--joy-palette-background-body)" }}
    >
      <Sidebar />
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <div key={pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
