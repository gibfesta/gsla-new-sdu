"use client";

import { usePathname } from "next/navigation";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = ["/", "/login", "/signup", "/join", "/superuser/dashboard"].includes(pathname);

  if (standalone) {
    return <main className="mx-auto min-h-screen w-full max-w-[1400px] px-5 py-8 md:px-8">{children}</main>;
  }

  return (
    <div className="min-h-screen">
      <HeaderBar />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 bg-white">
          <div className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
