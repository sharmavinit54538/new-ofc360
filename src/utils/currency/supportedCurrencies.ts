import type { CurrencyConfig } from "./types";
import { BASE_CURRENCIES } from "./inrUsdEur";
import { OTHER_CURRENCIES } from "./otherCurrencies";

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  ...BASE_CURRENCIES,
  ...OTHER_CURRENCIES,
};
