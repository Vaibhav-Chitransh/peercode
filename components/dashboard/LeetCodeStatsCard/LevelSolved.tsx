/* eslint-disable tailwindcss/classnames-order */
"use client";

import { Label, Pie, PieChart } from "recharts";

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

const chartConfig = {
  easy: {
    label: "Easy",
    color: "#22c55e", // Tailwind green-500
  },
  medium: {
    label: "Medium",
    color: "#eab308", // Tailwind yellow-500
  },
  hard: {
    label: "Hard",
    color: "#ef4444", // Tailwind red-500
  },
} satisfies ChartConfig;

interface Props {
  easy: number;
  medium: number;
  hard: number;
}

export function LevelSolved({ easy, medium, hard }: Props) {
  const totalSolved = easy + medium + hard;

  const chartData = [
    { level: "easy", solved: easy, fill: "#22c55e" },   // green
    { level: "medium", solved: medium, fill: "#eab308" }, // yellow
    { level: "hard", solved: hard, fill: "#ef4444" },   // red
  ];

  return (
    <Card className="flex flex-col text-dark100_light900">
      <CardHeader className="items-center pb-0">
        <CardTitle>Level Wise Solved</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="solved"
              nameKey="level"
              innerRadius={60}
              outerRadius={90}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold text-dark100_light900"
                        >
                          {totalSolved.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Solved
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
