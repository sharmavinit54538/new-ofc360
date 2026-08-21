import { extractManagerBaseCreate } from "./create/managerBaseCreatePayload";
import { extractManagerCompAndPerms } from "./create/managerCompCreatePayload";
import { extractManagerArraysAndMeta } from "./create/managerArraysCreatePayload";

export function buildManagerCreatePayload(input: any): Record<string, any> {
  const b = input || {};
  const payload = extractManagerBaseCreate(b);
  extractManagerCompAndPerms(b, payload);
  extractManagerArraysAndMeta(b, payload);
  return payload;
}
