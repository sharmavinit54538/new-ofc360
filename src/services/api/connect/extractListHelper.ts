export function extractListFromEnvelope(response: any, keyNames: string[] = []): any[] {
  if (!response || typeof response !== "object") return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  for (const key of keyNames) {
    if (Array.isArray(response[key])) return response[key];
    if (response.data && Array.isArray(response.data[key])) return response.data[key];
  }
  const keys = ["items", "results", "colleagues", "conversations", "messages", "calls", "history", "logs", "data"];
  for (const k of keys) {
    if (Array.isArray(response[k])) return response[k];
    if (response.data && Array.isArray(response.data[k])) return response.data[k];
  }
  return [];
}

