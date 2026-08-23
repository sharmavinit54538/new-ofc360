import { Search } from "lucide-react";

export function ReportsListSearch({ searchTerm, setSearchTerm, selectedType, setSelectedType }: {
  searchTerm: string; setSearchTerm: (s: string) => void; selectedType: string; setSelectedType: (t: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input type="text" placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-900/80 border border-slate-700 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 w-48" />
      </div>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-slate-900/80 border border-slate-700 text-xs text-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500">
        <option value="">All Types</option><option value="employee">Employee</option><option value="payroll">Payroll</option><option value="attendance">Attendance</option><option value="leave">Leave</option><option value="compliance">Compliance</option><option value="audit">Audit</option>
      </select>
    </div>
  );
}
