/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTheme } from "@/context/ThemeProvider";
import type { TooltipProps } from "recharts";

const CustomPieTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  const { mode } = useTheme();

  if (!active || !payload || payload.length === 0) return null;

  const { name, value, fill } = payload[0];

  const backgroundColor = mode === "dark" ? "#1f2937" : "#ffffff"; // dark-800 / white
  const textColor = mode === "dark" ? "#f3f4f6" : "#111827"; // light-100 / dark-900
  const borderColor = mode === "dark" ? "#374151" : "#e5e7eb"; // gray-700 / gray-200

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
      <div className="flex items-center gap-2">
        <div
          style={{
            backgroundColor: fill,
            width: "10px",
            height: "10px",
            borderRadius: "50%",
          }}
        />
        <div className="font-semibold capitalize">{name}</div>
      </div>
      <div className="mt-1 text-sm">
        Solved: <span className="font-bold">{value}</span>
      </div>
    </div>
  );
};

export default CustomPieTooltip;
