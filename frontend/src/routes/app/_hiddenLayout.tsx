import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../../components/Sidebar";

export const Route = createFileRoute("/app/_hiddenLayout")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fc]">
      <Sidebar />
      <main className="flex-1 px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
