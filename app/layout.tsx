import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/components/app-shell/AppShell";

export const metadata: Metadata = {
  title: "GSLA Web App",
  description: "GSLA Sports & Associations Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
