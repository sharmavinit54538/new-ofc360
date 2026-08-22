import { Phone } from "lucide-react";
import type { ContactInfoState } from "../types/contactInfoTypes";
import { ContactEmailsRow } from "./ContactEmailsRow";
import { ContactPhonesRow } from "./ContactPhonesRow";

export function ContactDetailsSection({ contact }: { contact: ContactInfoState }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/40 pb-2">
        <Phone className="w-4 h-4 text-primary" />
        <span>2. Contact Details & Communication</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ContactEmailsRow c={contact} />
        <ContactPhonesRow c={contact} />
      </div>
    </div>
  );
}
