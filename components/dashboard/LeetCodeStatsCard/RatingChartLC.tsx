/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useTheme } from "@/context/ThemeProvider";
import { useEffect, useState } from "react";

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
    // console.log(contestData);
    const { mode } = useTheme();
      const [currentTheme, setCurrentTheme] = useState(mode);
     useEffect(() => {
    setCurrentTheme(mode);
  }, [mode]);
  if (!contestData || contestData.length === 0) return null;
  
// Debug logs
// console.log("Theme mode:", mode);


// Safe client-side dark mode detection
const isDarkMode = typeof window !== 'undefined' ? (
  mode === "dark" || 
  document.documentElement.classList.contains('dark') ||
  document.body.classList.contains('dark') ||
  document.documentElement.getAttribute('data-theme') === 'dark'
) : mode === "dark";

// console.log("Is dark mode:", isDarkMode);

// Proper conditional logic with fallback detection
const axisTickColor = typeof window !== 'undefined' && isDarkMode ? "#ffffff" : "#1f2937";
// console.log("Axis tick color:", axisTickColor);
  
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
            <CardTitle className="text-dark100_light900 paragraph-regular font-bold">Rating Chart</CardTitle>
        </CardDescription>
        </div>
        <div className="w-8/12 flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
          <div>
            <p className="paragraph-regular font-semibold text-gray-900 dark:text-white">Current Rating - {currRating}</p>
            </div>
          <div>
             <p className="paragraph-regular font-semibold text-gray-900 dark:text-white">Highest Rating - {highestRating}</p>
            
            </div>
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
          key={mode}
            data={chartData}
            margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
          >

            <YAxis
              dataKey="rating"
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ 
                fill: axisTickColor, 
                fontSize: 14,
                fontWeight: 600
              }}
              style={{ fill: axisTickColor }}
            />
            <ChartTooltip
              cursor={{ stroke: "#ccc", strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-md bg-light-900
dark:bg-dark-200 p-3 shadow-lg text-dark100_light900">
                    <div className="font-semibold text-primary">{data.title}</div>
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