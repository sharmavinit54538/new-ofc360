import { create } from "zustand";
import type { DocItem } from "@/types/hr";

export const useDocumentStore = create<{
  documents: DocItem[]; categoryFilter: string; searchQuery: string;
  setCategoryFilter: (c: string) => void; setSearchQuery: (q: string) => void;
  addDocument: (d: DocItem) => void; deleteDocument: (id: string) => void;
}>((set) => ({
  documents: [], categoryFilter: "ALL", searchQuery: "",
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addDocument: (d) => set((s) => ({ documents: [d, ...s.documents] })),
  deleteDocument: (id) => set((s) => ({ documents: s.documents.filter((x) => x.id !== id) })),
}));