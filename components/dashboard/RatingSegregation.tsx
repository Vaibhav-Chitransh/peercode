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
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  solvedByRating: Record<number, number> | undefined;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RatingSegregation({ solvedByRating }: Props) {
  const chartData = solvedByRating
    ? Object.entries(solvedByRating).map(([rating, count]) => ({
        rating: `${rating}`,
        count,
      }))
    : [];

  return (
    <Card className="text-dark100_light900">
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
                tick={{ fill: "var(--foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--foreground)", fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="#1024b5" radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="count"
                  position="top"
                  style={{ fill: "#b31799", fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
