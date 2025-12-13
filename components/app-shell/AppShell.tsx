import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <HeaderBar />

      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-white">
          <div className="mx-auto w-full max-w-6xl px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
