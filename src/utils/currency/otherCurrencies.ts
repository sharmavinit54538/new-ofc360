import { PoundSterling, JapaneseYen, Coins, DollarSign } from "lucide-react";
import type { CurrencyConfig } from "./types";

export const OTHER_CURRENCIES: Record<string, CurrencyConfig> = {
  GBP: { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom", icon: PoundSterling, locale: "en-GB" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan", icon: JapaneseYen, locale: "ja-JP" },
  AED: { code: "AED", symbol: "AED", name: "UAE Dirham", country: "United Arab Emirates", icon: Coins, locale: "ar-AE" },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", country: "Canada", icon: DollarSign, locale: "en-CA" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia", icon: DollarSign, locale: "en-AU" },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore", icon: DollarSign, locale: "en-SG" },
};
