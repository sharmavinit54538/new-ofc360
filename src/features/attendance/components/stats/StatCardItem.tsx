import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function StatCardItem({ title, value, subtitle, icon: Icon, color, bg }: {
  title: string; value: string | number; subtitle: string; icon: LucideIcon; color: string; bg: string;
}) {
  return (
    <Card className="border border-border/60 shadow-sm bg-card hover:border-primary/40 transition-colors">
      <CardContent className="p-3.5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-xl font-bold mt-0.5 text-foreground">{value}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${bg} ${color}`}><Icon className="h-4 w-4" /></div>
      </CardContent>
    </Card>
  );
}
