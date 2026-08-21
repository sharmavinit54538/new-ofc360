import { create } from "zustand";
import type { Asset, AssetState } from "./assets/assetTypes";
import { INITIAL_MOCK_ASSETS } from "./assets/mockAssets";

export type { Asset };
export type AssetItem = Asset;

export const useAssetStore = create<AssetState & {
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: string) => void;
  setCategoryFilter: (c: string) => void;
  addAsset: (a: Asset | Omit<Asset, "id">) => void;
  updateAsset: (id: string, a: Partial<Asset>) => void;
  updateAssetStatus: (id: string, status: Asset["status"], assignedToName?: string, assignedToId?: string) => void;
  deleteAsset: (id: string) => void;
}>((set) => ({
  assets: INITIAL_MOCK_ASSETS,
  searchQuery: "",
  statusFilter: "ALL",
  categoryFilter: "ALL",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  addAsset: (asset) => set((s) => ({
    assets: [{ id: (asset as Asset).id || `AST-${Date.now()}`, ...asset } as Asset, ...s.assets],
  })),
  updateAsset: (id, a) => set((s) => ({ assets: s.assets.map((x) => x.id === id ? { ...x, ...a } : x) })),
  updateAssetStatus: (id, status, assignedToName, assignedToId) => set((s) => ({
    assets: s.assets.map((x) => x.id === id ? { ...x, status, assignedToName, assignedToId, assignedTo: assignedToName } : x),
  })),
  deleteAsset: (id) => set((s) => ({ assets: s.assets.filter((x) => x.id !== id) })),
}));