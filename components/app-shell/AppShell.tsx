"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import FacilitiesSidebar from "@/components/facilities/FacilitiesSidebar";
import FacilitiesDepartmentSidebar from "@/components/facilities/FacilitiesDepartmentSidebar";
import FacilitiesHeader from "@/components/facilities/FacilitiesHeader";
import SportsDevelopmentSidebar from "@/components/sports-development/SportsDevelopmentSidebar";
import HumanResourcesSidebar from "@/components/human-resources/HumanResourcesSidebar";
import FinanceSidebar from "@/components/finance/FinanceSidebar";
import DepartmentPageFrame from "@/components/shared/DepartmentPageFrame";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPage = ["/login", "/signup", "/join"].includes(pathname);
  const noSidebar = ["/", "/organisation/home", "/organisation/health"].includes(pathname);
  const ownHeader = ["/organisation/home", "/organisation/health"].includes(pathname);
  const facilitiesArea = pathname.startsWith("/facilities");
  const venueArea = /^\/facilities\/facilities-directory\/fac-[0-9]{3}(?:\/|$)/.test(pathname);
  const sportsDevelopmentArea = pathname.startsWith("/sports-development");
  const humanResourcesArea = pathname.startsWith("/human-resources");
  const financeArea = pathname.startsWith("/finance");

  if (publicPage) {
    return <main className="mx-auto min-h-screen w-full max-w-[1400px] px-8 py-8">{children}</main>;
  }

  if (facilitiesArea) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] lg:flex">
        {venueArea ? <Suspense fallback={<aside className="w-full shrink-0 bg-[#0d2d52] lg:w-[286px]" />}><FacilitiesSidebar /></Suspense> : <FacilitiesDepartmentSidebar />}
        <div className="min-w-0 flex-1">
          {venueArea && <FacilitiesHeader />}
          <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (sportsDevelopmentArea) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] lg:flex">
        <SportsDevelopmentSidebar />
        <div className="min-w-0 flex-1">
          <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-6"><DepartmentPageFrame department="sports-development">{children}</DepartmentPageFrame></main>
        </div>
      </div>
    );
  }

  if (humanResourcesArea) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] lg:flex">
        <HumanResourcesSidebar />
        <div className="min-w-0 flex-1">
          <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-6"><DepartmentPageFrame department="human-resources">{children}</DepartmentPageFrame></main>
        </div>
      </div>
    );
  }

  if (financeArea) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] lg:flex">
        <FinanceSidebar />
        <div className="min-w-0 flex-1">
          <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-6"><DepartmentPageFrame department="finance">{children}</DepartmentPageFrame></main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!ownHeader && <HeaderBar />}
      <div className="flex flex-col md:flex-row">
        {!noSidebar && <Sidebar />}
        <main className="min-w-0 flex-1 bg-white">
          <div className={ownHeader ? "w-full" : "mx-auto w-full max-w-[1400px] px-8 py-8"}>{children}</div>
        </main>
      </div>
    </div>
  );
}
