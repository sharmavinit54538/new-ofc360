import { ShieldCheck } from "lucide-react";
import { ComplianceCards } from "./ComplianceCards";
import { RiskAuditRegisterCard } from "./RiskAuditRegisterCard";
import { SecurityAuditLogCard } from "./SecurityAuditLogCard";

export function ComplianceTab({ compDashboardRes, compLoading, compError, compRisksRes, compReadinessRes, securityAuditRes }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-indigo-400" />AI Compliance Monitor & Risk Audit Register</h2>
      {compLoading ? <div className="p-8 text-center text-slate-400 text-sm">Loading compliance dashboard...</div> : compError ? <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">Unable to load compliance data.</div> : (
        <>
          <ComplianceCards compDashboardRes={compDashboardRes} compReadinessRes={compReadinessRes} />
          <RiskAuditRegisterCard compRisksRes={compRisksRes} />
          <SecurityAuditLogCard securityAuditRes={securityAuditRes} />
        </>
      )}
    </div>
  );
}
