/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTheme } from "@/context/ThemeProvider";
import HeatMap from "@uiw/react-heat-map";

interface CodeforcesHeatMap {
  [date: string]: number;
}

interface GitHubHeatMapEntry {
  date: string;
  contributionCount: number;
  color: string;
}

interface HeatMapProps {
  heatmap: CodeforcesHeatMap | GitHubHeatMapEntry[] | undefined;
}

const HeatMapComponent = ({ heatmap }: HeatMapProps) => {
  const { mode } = useTheme();

  type HeatMapValue = { date: string; count: number; color?: string };
  let value: HeatMapValue[] = [];
  let isGitHub = false;

  if (Array.isArray(heatmap)) {
    // GitHub format – use color directly from API
    isGitHub = true;
    value = heatmap.map((entry) => ({
      date: entry.date.replace(/-/g, "/"),
      count: entry.contributionCount,
      color: entry.color,
    }));
  } else {
    // Codeforces format – rely on count
    value = Object.entries(heatmap ?? {}).map(([date, count]) => ({
      date: date.replace(/-/g, "/"),
      count,
    }));
  }

  const today = new Date();
const oneYearAgo = new Date(today);
oneYearAgo.setFullYear(today.getFullYear() - 1);

  const panelColors =
    mode === "dark"
      ? {
          0: "#374151",
          1: "#4ade80",
          3: "#22c55e",
          5: "#16a34a",
          10: "#15803d",
        }
      : {
          0: "#e5e7eb",
          1: "#bbf7d0",
          3: "#86efac",
          5: "#4ade80",
          10: "#22c55e",
        };

  const emptyCellColor = mode === "dark" ? "#1f2937" : "#f3f4f6"; // Tailwind: dark: gray-800, light: gray-100

  return (
    <HeatMap
      value={value}
      width={780}
      weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
      startDate={oneYearAgo}
      endDate={today}
      style={
        {
          color: "#16db51",
          "--rhm-rect-active": "green",
        } as React.CSSProperties & Record<string, any>
      }
      panelColors={isGitHub ? undefined : panelColors}
      rectRender={(props, data) => {
        const d = data as HeatMapValue;

        // GitHub style: use GitHub's color unless count is 0
        if (isGitHub) {
          const fill = d.count === 0 ? emptyCellColor : d.color;
          return <rect {...props} fill={fill} />;
        }

        return <rect {...props} />;
      }}
    />
  );
};

export default HeatMapComponent;
