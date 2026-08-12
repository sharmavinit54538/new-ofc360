import { create } from "zustand";
import { type DocItem } from "@/types/hr";
import { getStoredData, setStoredData } from "@/utils/storage";

const STORAGE_KEY = "ofc360_documents_v2";

interface DocumentState {
  documents: DocItem[];
  searchQuery: string;
  categoryFilter: string;
  setSearchQuery: (q: string) => void;
  setCategoryFilter: (cat: string) => void;
  addDocument: (doc: Omit<DocItem, "id" | "updatedAt">) => void;
  deleteDocument: (id: string) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: getStoredData<DocItem[]>(STORAGE_KEY, []),
  searchQuery: "",
  categoryFilter: "ALL",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),

  addDocument: (docData) => {
    const nextId = `DOC-${String(get().documents.length + 101)}`;
    const newDoc: DocItem = {
      id: nextId,
      updatedAt: new Date().toISOString().split("T")[0],
      status: "Verified",
      ...docData,
    };
    const updated = [newDoc, ...get().documents];
    setStoredData(STORAGE_KEY, updated);
    set({ documents: updated });
  },

  deleteDocument: (id) => {
    const updated = get().documents.filter((doc) => doc.id !== id);
    setStoredData(STORAGE_KEY, updated);
    set({ documents: updated });
  },
}));
