import { ApprovalsStageCard } from "./ApprovalsStageCard";

export function ApprovalsWorkflowList() {
  const stages = [
    { idx: 0, title: "Stage 01: HR Operations Audit", role: "HR Auditor", desc: "Verifies Loss of Pay, active employee heads, and bank details." },
    { idx: 1, title: "Stage 02: Finance Director Approval", role: "Finance Director", desc: "Confirms tax declarations, allowances, and variable incentive checks." },
    { idx: 2, title: "Stage 03: Executive Sign-off & Lock", role: "Chief Financial Officer", desc: "Authorizes payout budget disbursement and releases bank advice." },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stages.map((s) => <ApprovalsStageCard key={s.idx} stage={s} />)}
    </div>
  );
}
