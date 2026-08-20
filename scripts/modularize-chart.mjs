import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function writeStrict(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);
  if (lines.length > 20) {
    console.warn(`WARNING: ${filePath} has ${lines.length} lines!`);
  }
  fs.writeFileSync(filePath, trimmed, 'utf8');
}

// -------------------------------------------------------------
// 2. CHART
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/components/ui/chart/chartTypes.ts'), `
import * as React from "react";

export const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};

export type ChartContextProps = {
  config: ChartConfig;
};
`);

writeStrict(path.join(root, 'src/components/ui/chart/chartContext.tsx'), `
import * as React from "react";
import type { ChartContextProps } from "./chartTypes";

export const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}
`);

writeStrict(path.join(root, 'src/components/ui/chart/chartStyle.tsx'), `
import * as React from "react";
import { THEMES, type ChartConfig } from "./chartTypes";

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, c]) => c.theme || c.color);
  if (!colorConfig.length) return null;
  return (
    <style dangerouslySetInnerHTML={{
      __html: Object.entries(THEMES).map(([theme, prefix]) => (
        prefix + " [data-chart=" + id + "] {\n" +
        colorConfig.map(([k, c]) => { const col = c.theme?.[theme as keyof typeof c.theme] || c.color; return col ? "  --color-" + k + ": " + col + ";" : null; }).filter(Boolean).join("\n") + "\n}"
      )).join("\n")
    }} />
  );
};
`);

writeStrict(path.join(root, 'src/components/ui/chart/chartContainer.tsx'), `
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import type { ChartConfig } from "./chartTypes";
import { ChartContext } from "./chartContext";
import { ChartStyle } from "./chartStyle";

export const ChartContainer = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { config: ChartConfig; children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]; }>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = "chart-" + (id || uniqueId.replace(/:/g, ""));
  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} ref={ref} className={cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none", className)} {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";
`);

writeStrict(path.join(root, 'src/components/ui/chart/chartHelper.ts'), `
import type { ChartConfig } from "./chartTypes";

export function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const p = payload as Record<string, any>;
  const payloadKey = p[key] ?? p.name ?? p.dataKey;
  return config[payloadKey] || config[key];
}
`);

writeStrict(path.join(root, 'src/components/ui/chart/chartTooltip.tsx'), `
import * as RechartsPrimitive from "recharts";
export const ChartTooltip = RechartsPrimitive.Tooltip;
export const ChartLegend = RechartsPrimitive.Legend;
`);

writeStrict(path.join(root, 'src/components/ui/chart/chartTooltipContent.tsx'), `
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import { useChart } from "./chartContext";
import { getPayloadConfigFromPayload } from "./chartHelper";

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof RechartsPrimitive.Tooltip> & React.ComponentProps<"div"> & { hideLabel?: boolean; hideIndicator?: boolean; indicator?: "line" | "dot" | "dashed"; nameKey?: string; labelKey?: string; }>(
  ({ active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey }, ref) => {
    const { config } = useChart();
    if (!active || !payload?.length) return null;
    return (
      <div ref={ref} className={cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className)}>
        {!hideLabel && <div className={cn("font-medium", labelClassName)}>{label}</div>}
        <div className="grid gap-1.5">{payload.map((item, i) => (<div key={i} className="flex w-full flex-wrap items-stretch gap-2">{item.name}: {item.value}</div>))}</div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";
`);

writeStrict(path.join(root, 'src/components/ui/chart/chartLegendContent.tsx'), `
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import { useChart } from "./chartContext";

export const ChartLegendContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & { hideIcon?: boolean; nameKey?: string; }>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();
    if (!payload?.length) return null;
    return (
      <div ref={ref} className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
        {payload.map((item) => (<div key={item.value} className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}>{item.value}</div>))}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";
`);

writeStrict(path.join(root, 'src/components/ui/chart.tsx'), `
export type { ChartConfig } from "./chart/chartTypes";
export { ChartContext, useChart } from "./chart/chartContext";
export { ChartContainer } from "./chart/chartContainer";
export { ChartTooltip, ChartLegend } from "./chart/chartTooltip";
export { ChartTooltipContent } from "./chart/chartTooltipContent";
export { ChartLegendContent } from "./chart/chartLegendContent";
export { ChartStyle } from "./chart/chartStyle";
`);

console.log('Modularized chart.tsx successfully!');
