import type { Metadata } from "next";

export const metadata: Metadata = { title: "Human Resources | GSLA WebApp" };

export default function DepartmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
