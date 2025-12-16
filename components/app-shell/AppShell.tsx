// AppShell
// ------------------------------------------------------------------
// Purpose:
// This component defines the *global application layout* that wraps
// every page in the app.
//
// Think of this as the structural skeleton of the UI:
// - Top navigation (HeaderBar)
// - Side navigation (Sidebar)
// - Main content area (children)
//
// IMPORTANT:
// - This file should only deal with layout and structure
// - Do NOT put page-specific logic or data fetching here
// ------------------------------------------------------------------

import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

export default function AppShell({
  children,
}: {
  // children = whatever page content is currently being rendered
  // (e.g. dashboard, profile page, admin screens, etc.)
  children: React.ReactNode;
}) {
  return (
    // Full-height wrapper to ensure sidebar + content stretch to viewport height
    <div className="min-h-screen">
      
      {/* ----------------------------------------------------------------
         HeaderBar
         - Global top navigation
         - Typically contains: app title, user menu, notifications, etc.
         - Edit visual/layout changes inside ./HeaderBar.tsx
      ---------------------------------------------------------------- */}
      <HeaderBar />

      {/* ----------------------------------------------------------------
         Main layout row
         - Flex container holding sidebar + main content
         - Sidebar stays fixed-width, main content grows
      ---------------------------------------------------------------- */}
      <div className="flex">
        
        {/* --------------------------------------------------------------
           Sidebar
           - Primary navigation for the app
           - Links to dashboard, sports, admin sections, etc.
           - Edit nav items and structure inside ./Sidebar.tsx
        -------------------------------------------------------------- */}
        <Sidebar />

        {/* --------------------------------------------------------------
           Main content area
           - flex-1 allows it to fill remaining horizontal space
           - Background color is intentionally white for consistency
        -------------------------------------------------------------- */}
        <main className="flex-1 bg-white">
          
          {/* ------------------------------------------------------------
             Inner content container
             - max-w-6xl keeps content readable on large screens
             - px-8 / py-8 control global page padding
             - THIS is where all page.tsx content ultimately renders
             - If spacing/layout feels off globally, adjust here
          ------------------------------------------------------------ */}
          <div className="mx-auto w-full max-w-6xl px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
