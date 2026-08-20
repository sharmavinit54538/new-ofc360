export interface FormatHealth {
  contactInfoComplete: boolean;
  hasSummary: boolean;
  hasClearHeadings: boolean;
  fontReadabilityScore: number;
  atsParsingHealth: "Good" | "Warning" | "Critical";
  formattingFlags: string[];
}
