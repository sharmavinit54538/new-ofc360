import type { ChartConfig } from "./chartTypes";

export function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const p = payload as Record<string, any>;
  const payloadKey = p[key] ?? p.name ?? p.dataKey;
  return config[payloadKey] || config[key];
}