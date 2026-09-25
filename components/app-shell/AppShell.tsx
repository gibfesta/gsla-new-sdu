"use client";

import { usePathname } from "next/navigation";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import FacilitiesSidebar from "@/components/facilities/FacilitiesSidebar";
import FacilitiesHeader from "@/components/facilities/FacilitiesHeader";
import SportsDevelopmentSidebar from "@/components/sports-development/SportsDevelopmentSidebar";
import SportsDevelopmentHeader from "@/components/sports-development/SportsDevelopmentHeader";
import HumanResourcesSidebar from "@/components/human-resources/HumanResourcesSidebar";
import HumanResourcesHeader from "@/components/human-resources/HumanResourcesHeader";
import FinanceSidebar from "@/components/finance/FinanceSidebar";
import FinanceHeader from "@/components/finance/FinanceHeader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPage = ["/login", "/signup", "/join"].includes(pathname);
  const noSidebar = ["/", "/superuser/dashboard", "/superuser/health"].includes(pathname);
  const ownHeader = ["/superuser/dashboard", "/superuser/health"].includes(pathname);
  const facilitiesArea = pathname.startsWith("/facilities");
  const sportsDevelopmentArea = pathname.startsWith("/sports-development");
  const humanResourcesArea = pathname.startsWith("/human-resources");
  const financeArea = pathname.startsWith("/finance");

  if (publicPage) {
    return <main className="mx-auto min-h-screen w-full max-w-[1400px] px-8 py-8">{children}</main>;
  }

  if (facilitiesArea) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] lg:flex">
        <FacilitiesSidebar />
        <div className="min-w-0 flex-1">
          <FacilitiesHeader />
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
          <SportsDevelopmentHeader />
          <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-6">{children}</main>
        </div>
      </div>
    );
  }

  if (humanResourcesArea) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] lg:flex">
        <HumanResourcesSidebar />
        <div className="min-w-0 flex-1">
          <HumanResourcesHeader />
          <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-6">{children}</main>
        </div>
      </div>
    );
  }

  if (financeArea) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] lg:flex">
        <FinanceSidebar />
        <div className="min-w-0 flex-1">
          <FinanceHeader />
          <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-6">{children}</main>
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
