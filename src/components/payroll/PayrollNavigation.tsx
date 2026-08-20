import { Button } from "@/components/ui/button";
import { usePayrollContext } from "./PayrollContext";
import { TABS } from "./tabsList";

export function PayrollNavigation() {
  const { activeTab, setTab } = usePayrollContext();
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/40 scrollbar-none">
      {TABS.map((t) => {
        const isSel = activeTab === t.id;
        return (
          <Button key={t.id} variant={isSel ? "default" : "ghost"} onClick={() => setTab(t.id)} className={`text-xs font-bold h-8 px-3 rounded-full shrink-0 ${isSel ? "gradient-bg text-primary-foreground" : "text-muted-foreground hover:bg-secondary/40"}`}>
            {t.label}
          </Button>
        );
      })}
    </div>
  );
}
