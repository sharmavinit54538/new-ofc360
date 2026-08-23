import { ShieldAlert } from "lucide-react";
import { RiskAuditItem } from "./RiskAuditItem";

export function RiskAuditRegisterCard({ compRisksRes }: { compRisksRes: any }) {
  const list = compRisksRes?.data || [];
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-rose-400" />Compliance Risk Audit Register</h3>
      {list.length > 0 ? (
        <div className="space-y-3">{list.map((r: any, i: number) => <RiskAuditItem key={i} risk={r} />)}</div>
      ) : <p className="text-xs text-slate-500">No active compliance risk violations recorded</p>}
    </div>
  );
}