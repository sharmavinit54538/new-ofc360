import type { CurrencyConfig } from "./types";
import { SUPPORTED_CURRENCIES } from "./supportedCurrencies";
import { parseCurrencyCode } from "./parseCurrencyCode";

export function getCurrencyConfig(currencyStr?: string): CurrencyConfig {
  const code = parseCurrencyCode(currencyStr);
  return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.INR;
}
