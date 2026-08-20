import { IndianRupee, DollarSign, Euro } from "lucide-react";
import type { CurrencyConfig } from "./types";

export const BASE_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India", icon: IndianRupee, locale: "en-IN" },
  USD: { code: "USD", symbol: "$", name: "US Dollar", country: "United States", icon: DollarSign, locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", country: "European Union", icon: Euro, locale: "de-DE" },
};
