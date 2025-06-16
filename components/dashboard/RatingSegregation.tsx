"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  // ChartTooltipContent,
} from "@/components/ui/chart";
import CustomBarTooltip from "@/components/ui/CustomBarTooltip";
import { useTheme } from "@/context/ThemeProvider";

interface Props {
  solvedByRating: Record<number, number> | undefined;
}

const chartConfig = {
  desktop: {
   label: "Rating",
    color: "#1024b5",
  },
} satisfies ChartConfig;

export function RatingSegregation({ solvedByRating }: Props) {
  const { mode } = useTheme();
  const isDarkMode =
  typeof window !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : mode === "dark";
  const tickColor = isDarkMode ? "#f3f4f6" : "#1f2937"; // lightGray / darkGray
  console.log("Dark Mode?", isDarkMode, "Tick Color:", tickColor);
  const chartData = solvedByRating
    ? Object.entries(solvedByRating).map(([rating, count]) => ({
        rating: `${rating}`,
        count,
      }))
    : [];

  return (
    <Card>
      <CardHeader className="h2-bold">
        <CardTitle>Rating Wise Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="rating"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: tickColor, fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: tickColor, fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<CustomBarTooltip />}
              />
              <Bar dataKey="count" fill="#1024b5" radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="count"
                  position="top"
                  style={{
                    fill: isDarkMode ? "#f9a8d4" : "#b31799",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}