import type { ComponentBreakdown } from "./types";

export function decomposeCtc(annualCtc: number, structureOverride?: {
  basicPct?: number; hraPct?: number; daPct?: number; conveyance?: number; lta?: number;
}): ComponentBreakdown {
  const monthlyCtc = Math.max(0, annualCtc / 12);
  const basic = Math.round(monthlyCtc * ((structureOverride?.basicPct ?? 50) / 100));
  const hra = Math.round(monthlyCtc * ((structureOverride?.hraPct ?? 20) / 100));
  const da = Math.round(monthlyCtc * ((structureOverride?.daPct ?? 10) / 100));
  const conveyance = structureOverride?.conveyance ?? 1600;
  const lta = structureOverride?.lta ?? 1250;
  const sumFixed = basic + hra + da + conveyance + lta;
  const specialAllowance = Math.max(0, monthlyCtc - sumFixed);
  return { basic, hra, da, specialAllowance, conveyance, lta, grossMonthly: Math.round(sumFixed + specialAllowance) };
}
