import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactInfoState } from "../types/contactInfoTypes";

export function ContactPhonesRow({ c }: { c: ContactInfoState }) {
  return (
    <>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Company Work Email</Label><Input type="email" placeholder="user@company.com" value={c.companyWorkEmail} onChange={(e) => c.setCompanyWorkEmail(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Phone Number *</Label><Input type="tel" placeholder="+91 9876543210" value={c.phone} onChange={(e) => c.setPhone(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono" required /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Alternate / Emergency Mobile</Label><Input type="tel" placeholder="+91 9876500000" value={c.alternatePhone} onChange={(e) => c.setAlternatePhone(e.target.value)} className="bg-secondary/30 text-xs h-10 border-border/60 font-mono" /></div>
    </>
  );
}
