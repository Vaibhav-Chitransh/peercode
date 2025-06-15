/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface Props {
  language: { language: string; percentage: string }[];
}

export function LanguageDist({ language }: Props) {
  const chartColors = Array.from(
    { length: 25 },
    (_, i) => `var(--chart-${i + 1})`
  );

  const chartData = language.map((item, index) => ({
    language: item.language,
    percentage: parseFloat(item.percentage),
    fill: chartColors[index % chartColors.length],
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.language] = {
      label: item.language,
      color: item.fill,
    };
    return acc;
  }, {} as any);

  return (
    <Card className="flex flex-col text-dark100_light900">
      <CardHeader className="items-center pb-0">
        <CardTitle>Language Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="language"
              isAnimationActive={false}
              outerRadius={100}
              labelLine={false}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="language" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
