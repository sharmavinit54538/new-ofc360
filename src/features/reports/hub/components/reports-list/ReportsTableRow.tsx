import { RefreshCw, Trash2 } from "lucide-react";

export function ReportsTableRow({ report, isRefreshing, isDeleting, onRefresh, onDelete }: any) {
  const isDone = report.status === "completed";
  const isProc = report.status === "processing";
  return (
    <tr className="hover:bg-slate-800/40 transition-colors">
      <td className="p-3.5"><p className="font-semibold text-slate-200">{report.name}</p>{report.description && <p className="text-[11px] text-slate-400 truncate max-w-xs">{report.description}</p>}</td>
      <td className="p-3.5 font-mono text-slate-300">{report.type}</td>
      <td className="p-3.5"><span className="uppercase text-[10px] px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">{report.format}</span></td>
      <td className="p-3.5"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${isDone ? "bg-emerald-500/20 text-emerald-300" : isProc ? "bg-blue-500/20 text-blue-300" : "bg-amber-500/20 text-amber-300"}`}>{report.status}</span></td>
      <td className="p-3.5 capitalize text-slate-400">{report.schedule || "none"}</td>
      <td className="p-3.5 text-slate-400">{new Date(report.created_at).toLocaleDateString()}</td>
      <td className="p-3.5 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => onRefresh(report.id)} disabled={isRefreshing} className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 rounded transition-colors cursor-pointer"><RefreshCw className="w-3.5 h-3.5" /></button><button onClick={() => onDelete(report.id)} disabled={isDeleting} className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
    </tr>
  );
}
