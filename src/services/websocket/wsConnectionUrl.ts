export function buildWebSocketUrl(token: string): string {
  const rawBase = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";
  try {
    const parsed = new URL(rawBase);
    const protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${parsed.host}/api/v1/connect/ws${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  } catch {
    const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
    return `${isSecure ? "wss:" : "ws:"}//api.ofc360.com/api/v1/connect/ws${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  }
}
