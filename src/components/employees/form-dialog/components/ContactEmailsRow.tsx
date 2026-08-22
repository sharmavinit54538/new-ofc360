import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactInfoState } from "../types/contactInfoTypes";

export function ContactEmailsRow({ c }: { c: ContactInfoState }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">Personal Email *</Label>
      <Input
        type="email"
        placeholder="user@gmail.com"
        value={c.personalEmail}
        onChange={(e) => c.setPersonalEmail(e.target.value)}
        className="bg-secondary/30 text-xs h-10 border-border/60"
        required
      />
    </div>
  );
}
