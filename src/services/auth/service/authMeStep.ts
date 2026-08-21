import { isValidToken } from "../authStorage";
import { formatAuthUser } from "./authNameHelper";

export async function fetchMeEndpoint(rawBaseUrl: string, currentToken?: string | null) {
  if (!isValidToken(currentToken)) {
    return { success: false, status: 401 };
  }
  try {
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken.trim()}`,
      },
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
