import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyFormData } from "../../types/companyTypes";

export function CompanyIdentityFields({ data, onChange }: { data: CompanyFormData; onChange: (d: CompanyFormData) => void }) {
  return (
    <>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Legal Company Name</Label><Input placeholder="Enter registered legal company name" value={data.companyName} onChange={(e) => onChange({ ...data, companyName: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Corporate Identification Number (CIN)</Label><Input placeholder="e.g. CIN-U72200MH2024PTC000000" value={data.registrationNumber} onChange={(e) => onChange({ ...data, registrationNumber: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">GST / Tax ID</Label><Input placeholder="e.g. 27AABCU9603R1ZM" value={data.gstNumber} onChange={(e) => onChange({ ...data, gstNumber: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Corporate Website URL</Label><Input placeholder="https://yourcompany.com" value={data.website} onChange={(e) => onChange({ ...data, website: e.target.value })} className="bg-secondary/30" /></div>
    </>
  );
}
