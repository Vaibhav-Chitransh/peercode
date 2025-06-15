/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tailwindcss/classnames-order */
"use client";

import { Area, AreaChart, CartesianGrid, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip
} from "@/components/ui/chart";

interface Props {
  contestData:
    | {
        title: any;
        date: string;
        rating: any;
        highestRating: any;
        delta: number;
        rank: number;
      }[]
    | undefined;
  highestRating: number | undefined;
  currRating: number | undefined;
}

export function RatingChartLC({ contestData, highestRating, currRating }: Props) {
    console.log(contestData);
  if (!contestData || contestData.length === 0) return null;

  const chartData = contestData.map((c) => ({
    date: c.date,
    rating: c.rating,
    title: c.title,
    rank: c.rank,
    delta: c.delta,
  }));

  const lineColor = "green";

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardDescription>
            <CardTitle className="text-dark100_light900 text-2xl">Rating Chart</CardTitle>
        </CardDescription>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-500 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
          <div>Current Rating - {currRating}</div>
          <div>Highest Rating - {highestRating}</div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            rating: {
              label: "Rating",
              color: lineColor,
            },
          }}
        >
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <YAxis
              dataKey="rating"
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={{ stroke: "#ccc", strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-md bg-background p-3 shadow-lg text-dark100_light900">
                    <div className="font-semibold text-primary">{data.contestName}</div>
                    <div className="text-xs text-muted-foreground">
                      📅 {data.date}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      🏆 Rank: {data.rank}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      📈 Delta: {data.delta >= 0 ? "+" : ""}
                      {data.delta}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ⭐ New Rating: {data.rating}
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="rating"
              fill={lineColor}
              fillOpacity={0.2}
              stroke={lineColor}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
