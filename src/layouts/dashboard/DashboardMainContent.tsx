import { Outlet } from "react-router-dom";
import { TopNav } from "@/components/TopNav";

export function DashboardMainContent({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopNav onMenuClick={onMenuClick} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin space-y-4">
        <Outlet />
      </main>
    </div>
  );
}
