"use client";

import Image from "next/image";
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
import { Bell, CalendarClock, BarChart3, FileDownIcon } from "lucide-react";

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

// Sample data - This needs to change and data needs to be picked up from a source... I dont know where or how.
const sportsData = [
  [
  { sport: "Athletics", participants: 0 },
  { sport: "Basketball", participants: 410 },
  { sport: "Swimming", participants: 780 },
  { sport: "Aquafit", participants: 0 },
  { sport: "Badminton", participants: 0 },
  { sport: "Billiards & Snooker", participants: 0 },
  { sport: "Boxing", participants: 0 },
  { sport: "Brazilian Jiu Jitsu", participants: 0 },
  { sport: "Canoeing / Kayaking", participants: 0 },
  { sport: "Climbing", participants: 0 },
  { sport: "Cricket", participants: 0 },
  { sport: "Cycling", participants: 0 },
  { sport: "Darts", participants: 0 },
  { sport: "Esports / Video Gaming", participants: 0 },
  { sport: "Sea Angling", participants: 0 },
  { sport: "Fencing", participants: 0 },
  { sport: "Football", participants: 1250 },
  { sport: "Golf", participants: 0 },
  { sport: "Hockey", participants: 260 },
  { sport: "Inline Skating", participants: 0 },
  { sport: "Island Games (multi-sport)", participants: 0 },
  { sport: "Jet Ski", participants: 0 },
  { sport: "Ju-Jitsu", participants: 0 },
  { sport: "Judo", participants: 0 },
  { sport: "Karate", participants: 0 },
  { sport: "Kickboxing", participants: 0 },
  { sport: "Mixed Martial Arts (MMA)", participants: 0 },
  { sport: "Model Flying", participants: 0 },
  { sport: "Netball", participants: 0 },
  { sport: "Padel", participants: 640 },
  { sport: "Parasports", participants: 0 },
  { sport: "Petanque", participants: 0 },
  { sport: "Pool", participants: 0 },
  { sport: "Rhythmic Gymnastics", participants: 0 },
  { sport: "Rugby", participants: 0 },
  { sport: "Shooting – Clay Target", participants: 0 },
  { sport: "Shooting – Pistol", participants: 0 },
  { sport: "Shooting – Target Rifle", participants: 0 },
  { sport: "Squash", participants: 0 },
  { sport: "Sub-Aqua / Diving", participants: 0 },
  { sport: "Table Tennis", participants: 0 },
  { sport: "Tabletop Gaming", participants: 0 },
  { sport: "Taekwondo", participants: 0 },
  { sport: "Tennis", participants: 520 },
  { sport: "Tenpin Bowling", participants: 0 },
  { sport: "Triathlon", participants: 0 },
  { sport: "Volleyball", participants: 0 },
  { sport: "Off-Road 4×4", participants: 0 },
  { sport: "Physical Activity (Older Adults)", participants: 0 }
]
];

const FormsDue = [
  { name: "Form A", due: 18 },
  { name: "Form B", due: 11 },
  { name: "Form C", due: 5 },
];

const UpComingCourses = [
  { name: "Surfing Level 3", due: 1 },
  { name: "Snowboarding", due: 12 },
  { name: "First Aid", due: 90},
];

const Renewals = [
  { name: "First Aid", due: 18 },
  { name: "Safeguarding", due: 11 },
  { name: "Vetting", due: 5 },
];

// The main homepage component
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl py-8 px-4 space-y-6">
        <div className="fixed top-4 left-4 z-50">
  <Image
    src="/gsla-transp-logo.png"
    alt="GSLA Logo"
    width={150}
    height={150}
  />
</div>

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Main Administrator Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Overview of ...
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

            <Button className="flex items-center gap-2">
              <FileDownIcon className="w-4 h-4" />
              Export
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
              <CardTitle> Upcoming Courses (Summary)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {UpComingCourses.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.name}</span>
                  <Badge variant="secondary">{item.due} due soon</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forms Due (Summary)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {FormsDue.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.name}</span>
                  <Badge variant="secondary">{item.due} due soon</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle> Renewals (Summary)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Renewals.map((item) => (
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
