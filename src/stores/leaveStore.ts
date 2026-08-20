import { create } from "zustand";
import type { LeaveRequest } from "@/types/hr";

export const useLeaveStore = create<{
  leaveRequests: LeaveRequest[]; statusFilter: string; searchQuery: string;
  setStatusFilter: (s: string) => void; setSearchQuery: (q: string) => void;
  addLeaveRequest: (r: LeaveRequest) => void; updateLeaveStatus: (id: string, s: LeaveRequest["status"]) => void;
}>((set) => ({
  leaveRequests: [], statusFilter: "ALL", searchQuery: "",
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addLeaveRequest: (r) => set((s) => ({ leaveRequests: [r, ...s.leaveRequests] })),
  updateLeaveStatus: (id, status) => set((s) => ({ leaveRequests: s.leaveRequests.map((r) => r.id === id ? { ...r, status } : r) })),
}));