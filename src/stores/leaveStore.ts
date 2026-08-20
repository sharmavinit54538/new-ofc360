import { create } from "zustand";
import { type LeaveRequest } from "@/types/hr";
import { getStoredData, setStoredData } from "@/utils/storage";

const STORAGE_KEY = "ofc360_leaves_v2";

interface LeaveState {
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (req: Omit<LeaveRequest, "id" | "createdAt" | "status"> & { status?: LeaveRequest["status"] }) => void;
  updateLeaveStatus: (id: string, status: "Approved" | "Denied" | "Rejected") => void;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  cancelLeaveRequest: (id: string) => void;
  deleteLeaveRequest: (id: string) => void;
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
  leaveRequests: getStoredData<LeaveRequest[]>(STORAGE_KEY, []),

  addLeaveRequest: (reqData) => {
    const nextId = `L${String(get().leaveRequests.length + 1).padStart(3, "0")}`;
    const newReq: LeaveRequest = {
      id: nextId,
      status: reqData.status || "Pending",
      createdAt: new Date().toISOString().split("T")[0],
      ...reqData,
    };
    const updated = [newReq, ...get().leaveRequests];
    setStoredData(STORAGE_KEY, updated);
    set({ leaveRequests: updated });
  },

  updateLeaveStatus: (id, status) => {
    const updated = get().leaveRequests.map((req) =>
      req.id === id ? { ...req, status } : req
    );
    setStoredData(STORAGE_KEY, updated);
    set({ leaveRequests: updated });
  },

  approveLeaveRequest: (id) => {
    get().updateLeaveStatus(id, "Approved");
  },

  rejectLeaveRequest: (id) => {
    get().updateLeaveStatus(id, "Rejected");
  },

  cancelLeaveRequest: (id) => {
    get().deleteLeaveRequest(id);
  },

  deleteLeaveRequest: (id) => {
    const updated = get().leaveRequests.filter((req) => req.id !== id);
    setStoredData(STORAGE_KEY, updated);
    set({ leaveRequests: updated });
  },
}));