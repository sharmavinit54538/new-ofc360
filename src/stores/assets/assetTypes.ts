export interface Asset {
  id: string;
  name: string;
  category: "Hardware" | "Software" | "Furniture" | "Vehicle" | "Access Card" | "Laptop" | "Desktop" | "Monitor" | "Phone" | "Accessories" | string;
  serialNumber: string;
  brandModel?: string;
  assetTag?: string;
  assignedTo?: string;
  assignedToId?: string;
  assignedToName?: string;
  status: "Available" | "Assigned" | "Under Maintenance" | "Retired" | "In Repair" | "Lost" | "Decommissioned";
  purchaseDate?: string;
  purchaseValue?: number;
  warrantyExpiry?: string;
  value?: number;
}
export interface AssetState {
  assets: Asset[];
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
}