"use client";

import { usePathname } from "next/navigation";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPage = ["/login", "/signup", "/join"].includes(pathname);
  const noSidebar = ["/", "/superuser/dashboard"].includes(pathname);
  const ownHeader = pathname === "/superuser/dashboard";

  if (publicPage) {
    return <main className="mx-auto min-h-screen w-full max-w-[1400px] px-8 py-8">{children}</main>;
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
