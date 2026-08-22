import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HRFormData } from "../../types/hrTypes";

export function HRGrievanceFields({ data, onChange }: { data: HRFormData; onChange: (d: HRFormData) => void }) {
  return (
    <div className="space-y-1.5 md:col-span-2">
      <Label className="text-xs font-semibold">Internal POSH & Grievance Email</Label>
      <Input
        type="email"
        placeholder="ethics.hr@yourcompany.com"
        value={data.grievanceEmail}
        onChange={(e) => onChange({ ...data, grievanceEmail: e.target.value })}
        className="bg-secondary/30"
      />
    </div>
  );
}
