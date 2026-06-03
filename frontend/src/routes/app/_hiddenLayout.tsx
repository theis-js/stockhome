import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../../components/Sidebar";

export const Route = createFileRoute("/app/_hiddenLayout")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f7f9fc] lg:flex-row">
      <Sidebar />
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <Outlet />
      </main>
    </div>
  );
}
