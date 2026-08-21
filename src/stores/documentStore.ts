import { create } from "zustand";
import type { DocItem } from "@/types/hr";

export const useDocumentStore = create<{
  documents: DocItem[];
  categoryFilter: string;
  searchQuery: string;
  setCategoryFilter: (c: string) => void;
  setSearchQuery: (q: string) => void;
  addDocument: (d: DocItem | (Omit<DocItem, "id"> & { id?: string })) => void;
  deleteDocument: (id: string) => void;
}>((set) => ({
  documents: [],
  categoryFilter: "ALL",
  searchQuery: "",
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addDocument: (d) =>
    set((s) => {
      const newDoc: DocItem = {
        id: d.id || `doc-${Date.now()}`,
        name: d.name,
        category: d.category || "Policy",
        type: d.type || "policy",
        size: d.size,
        author: d.author || "HR Admin",
        updatedAt: d.updatedAt || new Date().toISOString().split("T")[0],
        uploadedAt: d.uploadedAt || new Date().toISOString().split("T")[0],
        status: d.status || "Active",
        url: d.url || "",
      };
      return { documents: [newDoc, ...s.documents] };
    }),
  deleteDocument: (id) =>
    set((s) => ({ documents: s.documents.filter((x) => x.id !== id) })),
}));