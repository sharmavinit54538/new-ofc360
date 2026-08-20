import type { LucideIcon } from "lucide-react";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  country: string;
  icon: LucideIcon;
  locale: string;
}
