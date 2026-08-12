import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";

export interface TicketComment {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userEmail: string;
  userName: string;
  category: "IT Hardware" | "Payroll & Salary" | "Leave & Attendance" | "HR Query" | "General Support";
  subject: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  comments: TicketComment[];
}

interface HelpdeskState {
  tickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, "id" | "createdAt" | "status" | "comments">) => void;
  addComment: (ticketId: string, author: string, message: string) => void;
  updateStatus: (ticketId: string, status: SupportTicket["status"]) => void;
}

const STORAGE_KEY = "ofc360_helpdesk_tickets_v1";

export const useHelpdeskStore = create<HelpdeskState>((set, get) => ({
  tickets: getStoredData<SupportTicket[]>(STORAGE_KEY, []),

  createTicket: (ticketData) => {
    const nextId = `TICKET-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: nextId,
      createdAt: new Date().toLocaleDateString(),
      status: "Open",
      comments: [],
      ...ticketData,
    };
    const updated = [newTicket, ...get().tickets];
    setStoredData(STORAGE_KEY, updated);
    set({ tickets: updated });
  },

  addComment: (ticketId, author, message) => {
    const updated = get().tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          comments: [
            ...t.comments,
            {
              id: `CMT-${Date.now().toString().slice(-4)}`,
              author,
              message,
              createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
      }
      return t;
    });
    setStoredData(STORAGE_KEY, updated);
    set({ tickets: updated });
  },

  updateStatus: (ticketId, status) => {
    const updated = get().tickets.map((t) => (t.id === ticketId ? { ...t, status } : t));
    setStoredData(STORAGE_KEY, updated);
    set({ tickets: updated });
  },
}));
