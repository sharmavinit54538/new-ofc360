import { parseRetryAfter, delay } from "./retryHelpers";

export async function handleRateLimitRetry(result: any, rawBaseQuery: any, args: any, api: any, extraOptions: any) {
  if (result.error && result.error.status === 429 && !(extraOptions as any)?.isRetry) {
    const requestUrl = typeof args === "string" ? args : args.url || "";
    const waitTime = parseRetryAfter(result.error) || 1000;
    console.warn(`[API_429] Rate limited on ${requestUrl}. Backing off for ${waitTime}ms before 1-time retry...`);
    await delay(waitTime);
    const retryArgs = typeof args === "string" ? { url: args, _isRetry: true } : { ...args, _isRetry: true };
    return await rawBaseQuery(retryArgs, api, { ...extraOptions, isRetry: true });
  }
  return result;
}
