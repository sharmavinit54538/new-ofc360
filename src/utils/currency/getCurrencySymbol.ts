import { getCurrencyConfig } from "./getCurrencyConfig";

export function getCurrencySymbol(currencyStr?: string): string {
  return getCurrencyConfig(currencyStr).symbol;
}
