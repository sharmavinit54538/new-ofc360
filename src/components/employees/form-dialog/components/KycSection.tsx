import type { KycDocumentItem } from "@/types/hr";
import { KycSectionHeader } from "./KycSectionHeader";
import { KycCardItem } from "./KycCardItem";

export function KycSection({ kycDocuments, setKycDocuments }: { kycDocuments: KycDocumentItem[]; setKycDocuments: React.Dispatch<React.SetStateAction<KycDocumentItem[]>> }) {
  const handleAdd = () => setKycDocuments([...kycDocuments, { id: String(Date.now()), type: "AADHAAR", documentNumber: "" }]);
  const handleUpdate = (updated: KycDocumentItem) => setKycDocuments(kycDocuments.map((d) => (d.id === updated.id ? updated : d)));
  const handleRemove = (id: string) => setKycDocuments(kycDocuments.filter((d) => d.id !== id));
  return (
    <div className="space-y-4">
      <KycSectionHeader onAdd={handleAdd} />
      {kycDocuments.map((doc) => (
        <KycCardItem key={doc.id} doc={doc} onUpdate={handleUpdate} onRemove={() => handleRemove(doc.id)} />
      ))}
    </div>
  );
}
