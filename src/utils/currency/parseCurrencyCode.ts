export function parseCurrencyCode(currencyStr?: string): string {
  if (!currencyStr) return "INR";
  const str = currencyStr.toUpperCase();
  if (str.includes("INR") || str.includes("₹") || str.includes("INDIA") || str.includes("RUPEE")) return "INR";
  if (str.includes("USD") || (str.includes("$") && !str.includes("CA") && !str.includes("A") && !str.includes("S")) || str.includes("UNITED STATES") || str.includes("DOLLAR")) return "USD";
  if (str.includes("EUR") || str.includes("€") || str.includes("EURO")) return "EUR";
  if (str.includes("GBP") || str.includes("£") || str.includes("POUND") || str.includes("UK")) return "GBP";
  if (str.includes("JPY") || str.includes("¥") || str.includes("YEN") || str.includes("JAPAN")) return "JPY";
  if (str.includes("AED") || str.includes("DIRHAM") || str.includes("UAE")) return "AED";
  if (str.includes("CAD")) return "CAD";
  if (str.includes("AUD")) return "AUD";
  if (str.includes("SGD")) return "SGD";
  return "INR";
}
