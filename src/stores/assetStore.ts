import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";

export interface AssetItem {
  id: string;
  assetTag: string;
  name: string;
  category: "Laptop" | "Monitor" | "Workstation" | "Mobile Device" | "Peripheral" | "Network Hardware";
  brandModel: string;
  serialNumber: string;
  assignedToId?: string;
  assignedToName?: string;
  status: "Available" | "Assigned" | "In Repair" | "Lost" | "Decommissioned";
  purchaseValue: number;
  warrantyExpiry: string;
  registeredAt: string;
}

interface AssetState {
  assets: AssetItem[];
  addAsset: (asset: Omit<AssetItem, "id" | "assetTag" | "registeredAt">) => void;
  updateAssetStatus: (id: string, status: AssetItem["status"], assignedToName?: string, assignedToId?: string) => void;
  deleteAsset: (id: string) => void;
}

const STORAGE_KEY = "ofc360_assets_v1";

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: getStoredData<AssetItem[]>(STORAGE_KEY, []),

  addAsset: (asset) => {
    const count = get().assets.length + 1001;
    const newAsset: AssetItem = {
      id: `AST-${Date.now().toString().slice(-5)}`,
      assetTag: `AST-${count}`,
      registeredAt: new Date().toLocaleDateString(),
      ...asset,
    };
    const updated = [newAsset, ...get().assets];
    setStoredData(STORAGE_KEY, updated);
    set({ assets: updated });
  },

  updateAssetStatus: (id, status, assignedToName, assignedToId) => {
    const updated = get().assets.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          status,
          assignedToName: status === "Assigned" ? assignedToName : status === "Available" ? "" : a.assignedToName,
          assignedToId: status === "Assigned" ? assignedToId : status === "Available" ? "" : a.assignedToId,
        };
      }
      return a;
    });
    setStoredData(STORAGE_KEY, updated);
    set({ assets: updated });
  },

  deleteAsset: (id) => {
    const updated = get().assets.filter((a) => a.id !== id);
    setStoredData(STORAGE_KEY, updated);
    set({ assets: updated });
  },
}));