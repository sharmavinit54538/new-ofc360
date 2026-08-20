import type { LucideIcon } from "lucide-react";
import { getCurrencyConfig } from "./getCurrencyConfig";

export function getCurrencyIcon(currencyStr?: string): LucideIcon {
  return getCurrencyConfig(currencyStr).icon;
}
