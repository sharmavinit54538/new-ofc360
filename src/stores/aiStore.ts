/**
 * OFC360 AI State Store & Audit Logger
 * Manages model execution history, token usage analytics, and conversation persistence.
 */

import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";

export interface AIExecutionLog {
  id: string;
  modelId: string;
  modelTitle: string;
  category: string;
  promptSnippet: string;
  tokensUsed: number;
  latencyMs: number;
  status: "Success" | "Timeout" | "Failed";
  timestamp: string;
}

export interface AIMessage {
  id: string;
  modelId: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface AIState {
  logs: AIExecutionLog[];
  messages: AIMessage[];
  isStreaming: boolean;

  // Actions
  addLog: (log: Omit<AIExecutionLog, "id" | "timestamp">) => void;
  addMessage: (msg: Omit<AIMessage, "id" | "timestamp">) => void;
  clearMessages: (modelId?: string) => void;
  setIsStreaming: (streaming: boolean) => void;
}

const STORAGE_KEYS = {
  LOGS: "ofc360_ai_logs_v2",
  MESSAGES: "ofc360_ai_messages_v2",
};

export const useAIStore = create<AIState>((set, get) => ({
  logs: getStoredData<AIExecutionLog[]>(STORAGE_KEYS.LOGS, []),
  messages: getStoredData<AIMessage[]>(STORAGE_KEYS.MESSAGES, []),
  isStreaming: false,

  addLog: (log) => {
    const newLog: AIExecutionLog = {
      id: `AILOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      ...log,
    };
    const updated = [newLog, ...get().logs].slice(0, 100); // Keep last 100 logs
    setStoredData(STORAGE_KEYS.LOGS, updated);
    set({ logs: updated });
  },

  addMessage: (msg) => {
    const newMsg: AIMessage = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      ...msg,
    };
    const updated = [...get().messages, newMsg];
    setStoredData(STORAGE_KEYS.MESSAGES, updated);
    set({ messages: updated });
  },

  clearMessages: (modelId) => {
    const updated = modelId
      ? get().messages.filter((m) => m.modelId !== modelId)
      : [];
    setStoredData(STORAGE_KEYS.MESSAGES, updated);
    set({ messages: updated });
  },

  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
}));