// -----------------------------------------------------------------------------
// Global root layout for the entire GSLA Web App
// This file wraps *every* page and is the top-level layout in the Next.js app
// Edit carefully — changes here affect the whole application
// -----------------------------------------------------------------------------

// Global CSS import
// ------------------------------------------------------------
// This pulls in Tailwind + any global styles used across the app.
// Add/reset global styles in this file, NOT inside individual pages.
import "./globals.css";

// Next.js metadata typing
// ------------------------------------------------------------
// Used to define <head> metadata (title, description, etc.)
// These values act as defaults unless overridden in nested layouts/pages.
import type { Metadata } from "next";

// AppShell layout wrapper
// ------------------------------------------------------------
// AppShell is responsible for the main application chrome:
// - Sidebar
// - Top navigation
// - Layout spacing / containers
// Any global navigation or layout changes should be done in AppShell,
// not here.
import AppShell from "@/components/app-shell/AppShell";

// Default metadata for the application
// ------------------------------------------------------------
// Shown in browser tabs and used for SEO.
// Update title/description here if the app branding changes.
export const metadata: Metadata = {
  title: "GSLA Web App",
  description: "GSLA Sports & Associations Dashboard",
};

// Root layout component
// ------------------------------------------------------------
// This wraps all routes in the app directory.
// children = the currently active page or nested layout.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Root HTML element
    // ----------------------------------------------------------
    // lang attribute is important for accessibility and SEO.
    <html lang="en">
      {/* 
        Global body wrapper
        --------------------------------------------------------
        - min-h-screen ensures full-height layouts
        - bg-white sets the default app background
        - text-slate-900 sets the default text color
        Adjust global theming here if needed.
      */}
      <body className="min-h-screen bg-white text-slate-900">
        {/* 
          AppShell wraps all page content
          ------------------------------------------------------
          This is where persistent UI lives (sidebar, header, etc).
          Pages rendered via routing appear inside {children}.
        */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
