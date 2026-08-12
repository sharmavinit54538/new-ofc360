import { LucideIcon } from "lucide-react";
import { InsightCard } from "./InsightCard";

export interface InsightSectionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

interface InsightSectionProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  items: InsightSectionItem[];
}

export function InsightSection({
  title,
  subtitle,
  icon: Icon,
  items,
}: InsightSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 pb-1 border-b border-border/40">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <InsightCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            description={item.description}
            icon={item.icon}
            badge={item.badge}
          />
        ))}
      </div>
    </div>
  );
}
