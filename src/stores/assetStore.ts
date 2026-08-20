import { create } from "zustand";
import type { Asset, AssetState } from "./assets/assetTypes";
import { INITIAL_MOCK_ASSETS } from "./assets/mockAssets";

export type { Asset };

export const useAssetStore = create<AssetState & {
  setSearchQuery: (q: string) => void; setStatusFilter: (s: string) => void;
  setCategoryFilter: (c: string) => void; addAsset: (a: Asset) => void;
  updateAsset: (id: string, a: Partial<Asset>) => void; deleteAsset: (id: string) => void;
}>((set) => ({
  assets: INITIAL_MOCK_ASSETS, searchQuery: "", statusFilter: "ALL", categoryFilter: "ALL",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  addAsset: (asset) => set((s) => ({ assets: [asset, ...s.assets] })),
  updateAsset: (id, a) => set((s) => ({ assets: s.assets.map((x) => x.id === id ? { ...x, ...a } : x) })),
  deleteAsset: (id) => set((s) => ({ assets: s.assets.filter((x) => x.id !== id) })),
}));