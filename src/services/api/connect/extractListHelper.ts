export function extractListFromEnvelope(response: any, keyNames: string[] = []): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.data && Array.isArray(response.data)) return response.data;
  for (const key of keyNames) {
    if (Array.isArray(response[key])) return response[key];
    if (response.data && Array.isArray(response.data[key])) return response.data[key];
  }
  const keys = ["items", "results", "colleagues", "conversations", "messages"];
  for (const k of keys) {
    if (Array.isArray(response[k])) return response[k];
    if (response.data && Array.isArray(response.data[k])) return response.data[k];
  }
  return [];
}
