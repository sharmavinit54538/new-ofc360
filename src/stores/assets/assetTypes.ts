export interface Asset {
  id: string; name: string; category: "Hardware" | "Software" | "Furniture" | "Vehicle" | "Access Card";
  serialNumber: string; assignedTo?: string; assignedToName?: string;
  status: "Available" | "Assigned" | "Under Maintenance" | "Retired";
  purchaseDate: string; warrantyExpiry?: string; value: number;
}
export interface AssetState {
  assets: Asset[]; searchQuery: string; statusFilter: string; categoryFilter: string;
}