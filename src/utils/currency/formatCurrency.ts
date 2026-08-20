import { getCurrencyConfig } from "./getCurrencyConfig";
import { getCurrencySymbol } from "./getCurrencySymbol";

export function formatCurrency(amount: number, currencyStr?: string): string {
  if (typeof amount !== "number" || isNaN(amount)) return `${getCurrencySymbol(currencyStr)}0`;
  const cfg = getCurrencyConfig(currencyStr);
  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: "currency",
      currency: cfg.code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    return `${cfg.symbol}${amount.toLocaleString()}`;
  }
}

export function fmtMoney(amount: number, currencyStr?: string): string {
  return formatCurrency(amount, currencyStr);
}
