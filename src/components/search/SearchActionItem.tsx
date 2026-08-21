import { Badge } from "@/components/ui/badge";
import { ActionSearchItem } from "./searchTypes";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchActionItemProps {
  item: ActionSearchItem;
  isSelected?: boolean;
  onSelect: (item: ActionSearchItem) => void;
}

export function SearchActionItem({
  item,
  isSelected,
  onSelect,
}: SearchActionItemProps) {
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
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {item.title}
            </span>
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {item.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {item.shortcut && (
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold bg-muted border border-border/60 rounded text-muted-foreground shadow-xs">
            {item.shortcut}
          </kbd>
        )}
        <Badge
          variant="outline"
          className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        >
          Action
        </Badge>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
