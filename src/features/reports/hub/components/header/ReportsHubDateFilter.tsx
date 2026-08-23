import { Calendar } from "lucide-react";

export function ReportsHubDateFilter({ dateFrom, setDateFrom, dateTo, setDateTo }: {
  dateFrom: string; setDateFrom: (d: string) => void; dateTo: string; setDateTo: (d: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-1 text-xs">
      <Calendar className="w-4 h-4 text-slate-400 ml-2" />
      <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-transparent text-slate-300 border-none outline-none focus:ring-0 text-xs cursor-pointer" />
      <span className="text-slate-500">to</span>
      <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-transparent text-slate-300 border-none outline-none focus:ring-0 text-xs cursor-pointer mr-2" />
    </div>
  );
}
