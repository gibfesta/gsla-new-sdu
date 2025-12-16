"use client";

/**
 * This component renders a multi-line chart showing participation trends
 * across different sports over a 12-month period.
 *
 * Tech:
 * - Uses Recharts for visualization
 * - Wrapped in ResponsiveContainer so it scales with its parent
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

/**
 * Static demo data for the chart.
 *
 * Each object represents one month.
 * - `month` is used on the X-axis
 * - Each sport key becomes its own line in the chart
 *
 * 👉 To add/remove sports:
 * - Add/remove keys here (e.g. "Basketball")
 * - Add/remove a corresponding <Line /> below
 *
 * 👉 To replace with real data later:
 * - Swap this constant for fetched or prop-based data
 */
const data = [
  { month: "Jan", Football: 200, Cricket: 120, Athletics: 70, Swimming: 15 },
  { month: "Feb", Football: 240, Cricket: 150, Athletics: 90, Swimming: 45 },
  { month: "Mar", Football: 195, Cricket: 140, Athletics: 80, Swimming: 35 },
  { month: "Apr", Football: 230, Cricket: 160, Athletics: 110, Swimming: 40 },
  { month: "May", Football: 210, Cricket: 115, Athletics: 105, Swimming: 25 },
  { month: "Jun", Football: 240, Cricket: 95, Athletics: 120, Swimming: 30 },
  { month: "Jul", Football: 255, Cricket: 105, Athletics: 160, Swimming: 30 },
  { month: "Aug", Football: 285, Cricket: 95, Athletics: 170, Swimming: 35 },
  { month: "Sep", Football: 210, Cricket: 210, Athletics: 135, Swimming: 60 },
  { month: "Oct", Football: 205, Cricket: 275, Athletics: 190, Swimming: 85 },
  { month: "Nov", Football: 220, Cricket: 345, Athletics: 260, Swimming: 120 },
  { month: "Dec", Football: 190, Cricket: 320, Athletics: 280, Swimming: 135 },
];

export default function StatsLineChart() {
  return (
    /**
     * Fixed-height wrapper so the chart has space to render.
     * Width is controlled by the parent container.
     *
     * 👉 Change height here if the chart feels too tall/short.
     */
    <div className="h-[360px] w-full">
      {/**
       * ResponsiveContainer makes the chart automatically adapt
       * to the size of its parent div.
       */}
      <ResponsiveContainer width="100%" height="100%">
        {/**
         * LineChart is the main chart wrapper.
         * It receives the data array defined above.
         */}
        <LineChart data={data}>
          {/* X-axis maps to the `month` field */}
          <XAxis dataKey="month" />

          {/* Y-axis auto-scales based on values */}
          <YAxis />

          {/* Tooltip shows values on hover */}
          <Tooltip />

          {/* Legend displays sport names and color indicators */}
          <Legend />

          {/**
           * Individual sport lines.
           *
           * - `dataKey` must match a key in the data objects
           * - `dot={false}` removes point markers for a cleaner look
           * - `strokeWidth` controls line thickness
           *
           * 👉 To style colors later, add `stroke="#hexcolor"`
           */}
          <Line type="monotone" dataKey="Football" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Cricket" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Athletics" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Swimming" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
