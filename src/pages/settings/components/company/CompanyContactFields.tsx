import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyFormData } from "../../types/companyTypes";

export function CompanyContactFields({ data, onChange }: { data: CompanyFormData; onChange: (d: CompanyFormData) => void }) {
  return (
    <>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Primary Administrative Email</Label><Input type="email" placeholder="admin@yourcompany.com" value={data.officialEmail} onChange={(e) => onChange({ ...data, officialEmail: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Corporate Office Address</Label><Input placeholder="Street / Building / Floor / Suite" value={data.address} onChange={(e) => onChange({ ...data, address: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">City, State</Label><Input placeholder="e.g. Mumbai, Maharashtra" value={data.city} onChange={(e) => onChange({ ...data, city: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Country</Label><Input placeholder="e.g. India" value={data.country} onChange={(e) => onChange({ ...data, country: e.target.value })} className="bg-secondary/30" /></div>
    </>
  );
}
