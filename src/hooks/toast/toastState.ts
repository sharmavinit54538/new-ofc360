import type { State, Action, ToasterToast } from "./types";
import { reducer } from "./reducer";

let count = 0;
function genId() { count = (count + 1) % Number.MAX_SAFE_INTEGER; return count.toString(); }
export const listeners: Array<(state: State) => void> = [];
export let memoryState: State = { toasts: [] };
export function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}
export function toast({ ...props }: Omit<ToasterToast, "id">) {
  const id = genId();
  const update = (p: ToasterToast) => dispatch({ type: "UPDATE_TOAST", toast: { ...p, id } });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dismiss(); } } });
  return { id, dismiss, update };
}
