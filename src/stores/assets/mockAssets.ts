import type { Asset } from "./assetTypes";

export const INITIAL_MOCK_ASSETS: Asset[] = [
  { id: "AST-001", name: "MacBook Pro 16 M3 Max", category: "Hardware", serialNumber: "C02XYZ12345", assignedTo: "EMP-001", assignedToName: "Aarav Sharma", status: "Assigned", purchaseDate: "2024-01-15", warrantyExpiry: "2027-01-15", value: 249999 },
  { id: "AST-002", name: "Dell UltraSharp 32 4K", category: "Hardware", serialNumber: "CN-09876", assignedTo: "EMP-002", assignedToName: "Neha Patel", status: "Assigned", purchaseDate: "2024-02-10", warrantyExpiry: "2027-02-10", value: 54999 },
  { id: "AST-003", name: "Ergonomic Mesh Chair V2", category: "Furniture", serialNumber: "FUR-8891", assignedTo: "EMP-001", assignedToName: "Aarav Sharma", status: "Assigned", purchaseDate: "2023-11-20", value: 18500 },
];