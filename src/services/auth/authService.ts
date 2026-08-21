import type { AppDispatch, RootState } from "@/app/store";
import { runAuthBootstrap } from "./service/authSessionBootstrap";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";
let hasInitialized = false;
let initPromise: Promise<boolean> | null = null;

export const authService = {
  resetInitState() { hasInitialized = false; initPromise = null; },
  async initializeAuthSession(dispatch: AppDispatch, getState: () => RootState): Promise<boolean> {
    if (hasInitialized) return getState().auth.isAuthenticated;
    if (initPromise) return initPromise;
    initPromise = (async () => {
      const res = await runAuthBootstrap(dispatch, getState, rawBaseUrl);
      hasInitialized = true;
      return res;
    })().finally(() => { initPromise = null; });
    return initPromise;
  },
};
