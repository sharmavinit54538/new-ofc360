import {
  IndianRupee,
  DollarSign,
  Euro,
  PoundSterling,
  JapaneseYen,
  Coins,
  type LucideIcon,
} from "lucide-react";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  country: string;
  icon: LucideIcon;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    country: "India",
    icon: IndianRupee,
    locale: "en-IN",
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    country: "United States",
    icon: DollarSign,
    locale: "en-US",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    country: "European Union",
    icon: Euro,
    locale: "de-DE",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    country: "United Kingdom",
    icon: PoundSterling,
    locale: "en-GB",
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    country: "Japan",
    icon: JapaneseYen,
    locale: "ja-JP",
  },
  AED: {
    code: "AED",
    symbol: "AED",
    name: "UAE Dirham",
    country: "United Arab Emirates",
    icon: Coins,
    locale: "ar-AE",
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    name: "Canadian Dollar",
    country: "Canada",
    icon: DollarSign,
    locale: "en-CA",
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    country: "Australia",
    icon: DollarSign,
    locale: "en-AU",
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    country: "Singapore",
    icon: DollarSign,
    locale: "en-SG",
  },
};

export function parseCurrencyCode(currencyStr?: string): string {
  if (!currencyStr) return "INR";
  const str = currencyStr.toUpperCase();
  if (str.includes("INR") || str.includes("₹") || str.includes("INDIA") || str.includes("RUPEE")) {
    return "INR";
  }
  if (str.includes("USD") || (str.includes("$") && !str.includes("CA") && !str.includes("A") && !str.includes("S")) || str.includes("UNITED STATES") || str.includes("DOLLAR")) {
    return "USD";
  }
  if (str.includes("EUR") || str.includes("€") || str.includes("EURO")) {
    return "EUR";
  }
  if (str.includes("GBP") || str.includes("£") || str.includes("POUND") || str.includes("UK")) {
    return "GBP";
  }
  if (str.includes("JPY") || str.includes("¥") || str.includes("YEN") || str.includes("JAPAN")) {
    return "JPY";
  }
  if (str.includes("AED") || str.includes("DIRHAM") || str.includes("UAE")) {
    return "AED";
  }
  if (str.includes("CAD")) {
    return "CAD";
  }
  if (str.includes("AUD")) {
    return "AUD";
  }
  if (str.includes("SGD")) {
    return "SGD";
  }
  return "INR";
}

export function getCurrencyConfig(currencyStr?: string): CurrencyConfig {
  const code = parseCurrencyCode(currencyStr);
  return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.INR;
}

export function getCurrencyIcon(currencyStr?: string): LucideIcon {
  return getCurrencyConfig(currencyStr).icon;
}

export function getCurrencySymbol(currencyStr?: string): string {
  return getCurrencyConfig(currencyStr).symbol;
}

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

