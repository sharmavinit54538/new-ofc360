import type { AddressItem } from "@/types/hr";
import { AddressesSectionHeader } from "./AddressesSectionHeader";
import { AddressCardItem } from "./AddressCardItem";

export function AddressesSection({ addresses, setAddresses }: { addresses: AddressItem[]; setAddresses: React.Dispatch<React.SetStateAction<AddressItem[]>> }) {
  const handleAdd = () => setAddresses([...addresses, { id: String(Date.now()), type: "PERMANENT", line1: "", city: "", state: "", country: "India", pincode: "" }]);
  const handleUpdate = (updated: AddressItem) => setAddresses(addresses.map((a) => (a.id === updated.id ? updated : a)));
  const handleRemove = (id: string) => setAddresses(addresses.filter((a) => a.id !== id));
  return (
    <div className="space-y-4">
      <AddressesSectionHeader onAdd={handleAdd} />
      {addresses.map((addr, idx) => (
        <AddressCardItem key={addr.id} addr={addr} idx={idx} onUpdate={handleUpdate} onRemove={() => handleRemove(addr.id)} />
      ))}
    </div>
  );
}
