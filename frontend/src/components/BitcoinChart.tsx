import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { BitcoinPrice } from "../types";

interface BitcoinChartProps {
  data: BitcoinPrice[];
}

export const BitcoinChart: React.FC<BitcoinChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp).getTime(),
    formattedTime: format(new Date(item.timestamp), "MMM dd, HH:mm"),
  }));

  const formatTooltipLabel = (value: number) => {
    return format(new Date(value), "MMM dd, yyyy HH:mm");
  };

  const formatYAxisTick = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatXAxisTick = (value: number) => {
    return format(new Date(value), "MMM dd");
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatXAxisTick}
            className="text-sm"
          />
          <YAxis tickFormatter={formatYAxisTick} className="text-sm" />
          <Tooltip
            labelFormatter={formatTooltipLabel}
            formatter={(value: number) => [
              `$${value.toLocaleString()}`,
              "Price",
            ]}
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#f97316" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
