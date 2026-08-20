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