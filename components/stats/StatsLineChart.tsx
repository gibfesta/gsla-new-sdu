"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

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
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Football" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Cricket" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Athletics" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Swimming" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
