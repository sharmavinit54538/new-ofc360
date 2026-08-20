import * as React from "react";
import { THEMES, type ChartConfig } from "./chartTypes";

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, c]) => c.theme || c.color);
  if (!colorConfig.length) return null;
  return (
    <style dangerouslySetInnerHTML={{
      __html: Object.entries(THEMES).map(([theme, prefix]) => (
        prefix + " [data-chart=" + id + "] {
" +
        colorConfig.map(([k, c]) => { const col = c.theme?.[theme as keyof typeof c.theme] || c.color; return col ? "  --color-" + k + ": " + col + ";" : null; }).filter(Boolean).join("
") + "
}"
      )).join("
")
    }} />
  );
};