import { CATEGORIES } from "../../constants/reportCategories";
import type { ReportCategory } from "../../types";

export function ReportsCategoryTabs({ activeCategory, onSelect }: { activeCategory: ReportCategory; onSelect: (t: ReportCategory) => void }) {
  return (
    <div className="border-b border-slate-800">
      <div className="flex gap-2 overflow-x-auto pb-px scrollbar-none">
        {CATEGORIES.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button key={tab.id} onClick={() => onSelect(tab.id)} className={`flex items-center gap-2.5 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${isActive ? "border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl" : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"}`}><Icon className="w-4 h-4" />{tab.label}</button>
          );
        })}
      </div>
    </div>
  );
}
