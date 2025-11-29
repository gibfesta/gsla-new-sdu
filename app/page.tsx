"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bell, CalendarClock, BarChart3 } from "lucide-react";

// Theme colors for later expansion
const theme = {
  primary: "#0c2f57",
  primaryDark: "#081d37",
  accent: "#d81e27",
  gold: "#f2b705",
  slate: "#0f172a",
  bg: "#f8fafc",
  cardBg: "#ffffff",
  soft: "#e2e8f0",
};

// Sample data
const sportsData = [
  { sport: "Football", participants: 1250 },
  { sport: "Padel", participants: 640 },
  { sport: "Tennis", participants: 520 },
  { sport: "Basketball", participants: 410 },
  { sport: "Swimming", participants: 780 },
  { sport: "Hockey", participants: 260 },
];

const coachRenewals = [
  { name: "First Aid", due: 18 },
  { name: "Safeguarding", due: 11 },
  { name: "NPLQ", due: 5 },
];

// The main homepage component
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl py-8 px-4 space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              GSLA NEW SDU Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Overview of participation, facilities, and coach development.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alerts
            </Button>
            <Button className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4" />
              New Course
            </Button>
          </div>
        </header>

        {/* 2 cards section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Participants by Sport
                <BarChart3 className="w-4 h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sportsData}>
                  <XAxis dataKey="sport" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="participants" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coach Renewals (Summary)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coachRenewals.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.name}</span>
                  <Badge variant="secondary">{item.due} due soon</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Placeholder */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-1">
              <p>- Add more charts and analytics.</p>
              <p>- Add tabs for Facilities, Courses, Associations, Individuals.</p>
              <p>- Connect to your real GSLA databases.</p>
              <p>- Things I need to do....</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
