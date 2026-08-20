import { create } from "zustand";

export interface HelpdeskTicket { id: string; subject: string; category: string; priority: "Low" | "Medium" | "High" | "Urgent"; status: "Open" | "In Progress" | "Resolved" | "Closed"; employeeId: string; employeeName: string; createdAt: string; }
export const useHelpdeskStore = create<{
  tickets: HelpdeskTicket[]; statusFilter: string; searchQuery: string;
  setStatusFilter: (s: string) => void; setSearchQuery: (q: string) => void;
  addTicket: (t: HelpdeskTicket) => void; updateTicketStatus: (id: string, s: HelpdeskTicket["status"]) => void;
}>((set) => ({
  tickets: [], statusFilter: "ALL", searchQuery: "",
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addTicket: (t) => set((s) => ({ tickets: [t, ...s.tickets] })),
  updateTicketStatus: (id, status) => set((s) => ({ tickets: s.tickets.map((t) => t.id === id ? { ...t, status } : t) })),
}));