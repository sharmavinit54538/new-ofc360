import { isValidToken } from "../authStorage";
import { formatAuthUser } from "./authNameHelper";

export async function fetchMeEndpoint(rawBaseUrl: string, currentToken?: string | null) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (isValidToken(currentToken)) {
      headers["Authorization"] = `Bearer ${currentToken.trim()}`;
    }
    const fetchOptions: RequestInit = {
      method: "GET",
      headers,
      credentials: "include",
    };
    const meRes = await fetch(`${rawBaseUrl}/api/v1/auth/me`, fetchOptions);
    if (meRes.status === 200) {
      const json = await meRes.json();
      return { success: true, user: formatAuthUser(json.data || json) };
    }
    return { success: false, status: meRes.status };
  } catch {
    return { success: false, status: 0 };
  }
}

