import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/types/hr";
import { GENDER_OPTIONS } from "../constants/genderOptions";
import { BLOOD_GROUP_OPTIONS } from "../constants/bloodGroupOptions";
import { MARITAL_STATUS_OPTIONS } from "../constants/maritalOptions";
import type { BasicInfoState } from "../types/basicInfoTypes";

export function BasicInfoDetailsRow({ b }: { b: BasicInfoState }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Gender</Label><Select value={b.gender} onValueChange={(v) => b.setGender(v as Employee["gender"])}><SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60"><SelectValue /></SelectTrigger><SelectContent>{GENDER_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Date of Birth</Label><Input type="date" value={b.dob} onChange={(e) => b.setDob(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Blood Group</Label><Select value={b.bloodGroup} onValueChange={(v) => b.setBloodGroup(v as Employee["bloodGroup"])}><SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60"><SelectValue /></SelectTrigger><SelectContent>{BLOOD_GROUP_OPTIONS.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Marital Status</Label><Select value={b.maritalStatus} onValueChange={(v) => b.setMaritalStatus(v as Employee["maritalStatus"])}><SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60"><SelectValue /></SelectTrigger><SelectContent>{MARITAL_STATUS_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
    </div>
  );
}
