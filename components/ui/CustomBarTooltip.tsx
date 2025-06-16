/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/chart/CustomBarTooltip.tsx
"use client";

import { useTheme } from "@/context/ThemeProvider";
import type { TooltipProps } from "recharts";

const CustomBarTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  const { mode } = useTheme();

  if (!active || !payload || payload.length === 0) return null;

  const { rating, count } = payload[0].payload;

  const backgroundColor = mode === "dark" ? "#1f2937" : "#ffffff";
  const textColor = mode === "dark" ? "#f3f4f6" : "#111827";
  const borderColor = mode === "dark" ? "#374151" : "#e5e7eb";

  return (
    <div
      className="rounded-md p-3 shadow-md transition-all duration-200"
      style={{
        backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        minWidth: "110px",
      }}
    >
      <div className="font-semibold">Rating: {rating}</div>
      <div className="mt-1 text-sm">Solved: <span className="font-bold">{count}</span></div>
    </div>
  );
};

export default CustomBarTooltip;
