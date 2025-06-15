/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import HeatMap from "@uiw/react-heat-map";
// import Tooltip from "@uiw/react-tooltip";

interface HeatMapProps {
  heatmap: Record<string, number> | undefined;
}

const HeatMapComponent = ({ heatmap }: HeatMapProps) => {
  const value = Object.entries(heatmap ?? {}).map(([date, count]) => ({
    date: date.replace(/-/g, "/"), // Convert 'YYYY-MM-DD' to 'YYYY/MM/DD'
    count,
  }));

  // Optional: Determine the earliest date for `startDate`
  const dates = Object.keys(heatmap ?? {}).map((d) => new Date(d));
  const minDate = dates.length ? new Date(Math.min(...dates.map((d) => d.getTime()))) : new Date();

  return (
    <HeatMap
      value={value}
      width={780}
      weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
      startDate={minDate}
      style={{ color: "#16db51", "--rhm-rect-active": "green" } as React.CSSProperties & Record<string, any>}
      panelColors={{
        0: "#ebedf0",
        1: "#9be9a8",
        3: "#40c463",
        5: "#30a14e",
        10: "#216e39",
      }}
      rectRender={(props, data) => {
        if (!data.count) return <rect {...props} />;
        // return (
        //   <Tooltip
        //     placement="top"
        //     content={`Solved: ${data.count}`}
        //     getPopupContainer={(node: HTMLElement | null) => node}
        //   >
        //     <rect {...props} />
        //   </Tooltip>
        // );
      }}
    />
  );
};

export default HeatMapComponent;
