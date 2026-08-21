import { isValidToken } from "../authStorage";
import { formatAuthUser } from "./authNameHelper";

export async function fetchRefreshAndRetry(rawBaseUrl: string, inMemoryRefreshToken?: string | null) {
  const refreshRes = await fetch(`${rawBaseUrl}/api/v1/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: (inMemoryRefreshToken || "").trim(), refresh_token: (inMemoryRefreshToken || "").trim() }),
    credentials: "include",
  });
  if (refreshRes.status !== 200) return null;
  const json = await refreshRes.json();
  const resData = json.data || json;
  const newToken = resData.access_token || resData.token;
  const newRefreshToken = resData.refresh_token || resData.refreshToken;
  if (!isValidToken(newToken)) return null;
  const retryMeRes = await fetch(`${rawBaseUrl}/api/v1/auth/me`, { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${newToken.trim()}` }, credentials: "include" });
  if (retryMeRes.status !== 200) return null;
  const retryJson = await retryMeRes.json();
  return { user: formatAuthUser(retryJson.data || retryJson), token: newToken.trim(), refreshToken: isValidToken(newRefreshToken) ? newRefreshToken.trim() : inMemoryRefreshToken || null };
}
