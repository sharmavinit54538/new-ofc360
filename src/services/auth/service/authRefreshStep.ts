import { isValidToken, getStoredRefreshToken } from "../authStorage";
import { formatAuthUser } from "./authNameHelper";

export async function fetchRefreshAndRetry(rawBaseUrl: string, inMemoryRefreshToken?: string | null) {
  const tokenToUse = isValidToken(inMemoryRefreshToken) ? inMemoryRefreshToken : getStoredRefreshToken();

  try {
    const refreshBody: Record<string, string> = {};
    if (isValidToken(tokenToUse)) {
      refreshBody.refreshToken = tokenToUse.trim();
      refreshBody.refresh_token = tokenToUse.trim();
    }

    const refreshRes = await fetch(`${rawBaseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: Object.keys(refreshBody).length > 0 ? JSON.stringify(refreshBody) : undefined,
      credentials: "include",
    });
    if (refreshRes.status !== 200) return null;
    const json = await refreshRes.json();
    const resData = json.data || json;
    const newToken = resData.access_token || resData.token;
    const newRefreshToken = resData.refresh_token || resData.refreshToken;

    const meHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (isValidToken(newToken)) {
      meHeaders["Authorization"] = `Bearer ${newToken.trim()}`;
    }

    const retryMeRes = await fetch(`${rawBaseUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: meHeaders,
      credentials: "include",
    });
    if (retryMeRes.status === 200) {
      const retryJson = await retryMeRes.json();
      return {
        user: formatAuthUser(retryJson.data || retryJson),
        token: isValidToken(newToken) ? newToken.trim() : (tokenToUse || ""),
        refreshToken: isValidToken(newRefreshToken) ? newRefreshToken.trim() : (tokenToUse || undefined),
      };
    } else if (resData.user) {
      return {
        user: formatAuthUser(resData.user),
        token: isValidToken(newToken) ? newToken.trim() : (tokenToUse || ""),
        refreshToken: isValidToken(newRefreshToken) ? newRefreshToken.trim() : (tokenToUse || undefined),
      };
    }
    return null;
  } catch {
    return null;
  }
}

