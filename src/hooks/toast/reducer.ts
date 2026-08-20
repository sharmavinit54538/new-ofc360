import type { State, Action } from "./types";

export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 1000000;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "UPDATE_TOAST":
      return { ...state, toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)) };
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.map((t) => (t.id === action.toastId || action.toastId === undefined ? { ...t, open: false } : t)) };
    case "REMOVE_TOAST":
      return action.toastId === undefined ? { ...state, toasts: [] } : { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };
  }
};
