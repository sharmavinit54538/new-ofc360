import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BasicInfoState } from "../types/basicInfoTypes";

export function BasicInfoNamesRow({ b }: { b: BasicInfoState }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">First Name *</Label>
        <Input placeholder="Jane" value={b.firstName} onChange={(e) => b.setFirstName(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Last Name *</Label>
        <Input placeholder="Cooper" value={b.lastName} onChange={(e) => b.setLastName(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" required />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between"><Label className="text-xs font-semibold">Employee ID</Label><span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Auto-Generated</span></div>
        <Input placeholder="Auto-assigned by system (e.g. EMP-1001)" value={b.employeeCode || "Auto-assigned by system on create"} readOnly disabled className="bg-secondary/40 text-xs h-10 border-border/60 font-mono text-muted-foreground cursor-not-allowed" />
      </div>
    </div>
  );
}
