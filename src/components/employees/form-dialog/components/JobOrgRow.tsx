import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_OPTIONS, type SystemRole } from "@/features/auth/authTypes";
import type { Employee } from "@/types/hr";
import { DEPARTMENT_OPTIONS } from "../constants/departmentOptions";
import { EMPLOYMENT_TYPE_OPTIONS } from "../constants/employmentTypeOptions";
import type { JobDetailsState } from "../types/jobDetailsTypes";
import type { JobMetaState } from "../types/jobMetaTypes";

export function JobOrgRow({ j, m }: { j: JobDetailsState; m: JobMetaState }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Department *</Label><Select value={j.department} onValueChange={(v) => j.setDepartment(v as Employee["department"])}><SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60"><SelectValue /></SelectTrigger><SelectContent>{DEPARTMENT_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Role *</Label><Select value={m.role} onValueChange={(v) => m.setRole(v as SystemRole)}><SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60 font-semibold text-primary"><SelectValue /></SelectTrigger><SelectContent>{ROLE_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Designation *</Label><Input placeholder="Senior Frontend Engineer" value={j.designation} onChange={(e) => j.setDesignation(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" required /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Employment Type *</Label><Select value={j.employmentType} onValueChange={(v) => j.setEmploymentType(v as Employee["employmentType"])}><SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60"><SelectValue /></SelectTrigger><SelectContent>{EMPLOYMENT_TYPE_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
    </div>
  );
}
