import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HRFormData } from "../../types/hrTypes";

export function HRContactFields({ data, onChange }: { data: HRFormData; onChange: (d: HRFormData) => void }) {
  return (
    <>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Head of HR / Chief People Officer</Label><Input placeholder="Enter HR Head name" value={data.headName} onChange={(e) => onChange({ ...data, headName: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Official HR Desk Email</Label><Input type="email" placeholder="hr@yourcompany.com" value={data.officialEmail} onChange={(e) => onChange({ ...data, officialEmail: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">HR Emergency Helpline Phone</Label><Input placeholder="+91 00000 00000" value={data.phone} onChange={(e) => onChange({ ...data, phone: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Executive Escalation VP</Label><Input placeholder="e.g. VP People / Legal Head" value={data.escalationLead} onChange={(e) => onChange({ ...data, escalationLead: e.target.value })} className="bg-secondary/30" /></div>
    </>
  );
}
