import type { EmergencyContactItem } from "@/types/hr";
import { EmergencyContactsSectionHeader } from "./EmergencyContactsSectionHeader";
import { EmergencyContactCardItem } from "./EmergencyContactCardItem";

export function EmergencyContactsSection({ emergencyContacts, setEmergencyContacts }: {
  emergencyContacts: EmergencyContactItem[]; setEmergencyContacts: React.Dispatch<React.SetStateAction<EmergencyContactItem[]>>;
}) {
  const handleAdd = () => setEmergencyContacts([...emergencyContacts, { id: String(Date.now()), name: "", relationship: "Spouse", primaryPhone: "" }]);
  const handleUpdate = (updated: EmergencyContactItem) => setEmergencyContacts(emergencyContacts.map((c) => (c.id === updated.id ? updated : c)));
  const handleRemove = (id: string) => setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id));
  return (
    <div className="space-y-4">
      <EmergencyContactsSectionHeader onAdd={handleAdd} />
      {emergencyContacts.map((contact) => (
        <EmergencyContactCardItem key={contact.id} contact={contact} onUpdate={handleUpdate} onRemove={() => handleRemove(contact.id)} />
      ))}
    </div>
  );
}
