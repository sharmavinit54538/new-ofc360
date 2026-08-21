import { Badge } from "@/components/ui/badge";
import { NavSearchItem } from "./searchTypes";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchNavItemProps {
  item: NavSearchItem;
  isSelected?: boolean;
  onSelect: (item: NavSearchItem) => void;
}

export function SearchNavItem({
  item,
  isSelected,
  onSelect,
}: SearchNavItemProps) {
  const Icon = item.icon;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(item)}
      className={cn(
        "group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 border",
        isSelected
          ? "bg-primary/10 border-primary/30 shadow-sm"
          : "hover:bg-accent/60 border-transparent hover:border-border/40"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {item.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium text-muted-foreground/80">{item.section}</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="font-mono text-[11px] text-muted-foreground/70">{item.path}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        <Badge
          variant="outline"
          className="text-[10px] font-mono bg-secondary/50 text-muted-foreground border-border/40 hidden sm:inline-flex"
        >
          Page
        </Badge>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
