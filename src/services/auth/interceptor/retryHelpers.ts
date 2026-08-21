import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const waitFor = (fn: () => boolean, timeoutMs = 2000, intervalMs = 50): Promise<boolean> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (fn()) { clearInterval(interval); resolve(true); }
      else if (Date.now() - startTime > timeoutMs) { clearInterval(interval); resolve(false); }
    }, intervalMs);
  });
};

export const parseRetryAfter = (error: FetchBaseQueryError): number | null => {
  try {
    const response = (error as any)?.meta?.response as Response | undefined;
    const retryHeader = response?.headers?.get("retry-after");
    if (!retryHeader) return null;
    const seconds = parseInt(retryHeader, 10);
    if (!isNaN(seconds) && seconds > 0) return Math.min(seconds * 1000, 10000);
    const targetTime = new Date(retryHeader).getTime();
    if (!isNaN(targetTime)) return Math.max(0, Math.min(targetTime - Date.now(), 10000));
  } catch {}
  return null;
};
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
