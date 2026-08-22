import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyFormData } from "../../types/companyTypes";

export function CompanyLocationFields({ data, onChange }: { data: CompanyFormData; onChange: (d: CompanyFormData) => void }) {
  return (
    <>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Default Timezone</Label><Input placeholder="e.g. Asia/Kolkata (IST +05:30)" value={data.timezone} onChange={(e) => onChange({ ...data, timezone: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Operating Currency</Label><Input placeholder="e.g. INR (₹), USD ($)" value={data.currency} onChange={(e) => onChange({ ...data, currency: e.target.value })} className="bg-secondary/30" /></div>
    </>
  );
}
