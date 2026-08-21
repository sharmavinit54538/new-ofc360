import React from "react";
import { SearchCategory } from "./searchTypes";
import { Users, Target, Compass, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchCategoryTabsProps {
  activeCategory: SearchCategory;
  onSelectCategory: (cat: SearchCategory) => void;
  counts: {
    all: number;
    employees: number;
    candidates: number;
    pages: number;
    actions: number;
  };
}

export function SearchCategoryTabs({
  activeCategory,
  onSelectCategory,
  counts,
}: SearchCategoryTabsProps) {
  const tabs: { id: SearchCategory; label: string; icon: React.ElementType; count: number }[] = [
    { id: "all", label: "All", icon: Sparkles, count: counts.all },
    { id: "employees", label: "Workforce", icon: Users, count: counts.employees },
    { id: "candidates", label: "Candidates", icon: Target, count: counts.candidates },
    { id: "pages", label: "Pages", icon: Compass, count: counts.pages },
    { id: "actions", label: "Actions", icon: Zap, count: counts.actions },
  ];

  return (
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/40 bg-muted/20 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectCategory(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={cn(
                  "ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
