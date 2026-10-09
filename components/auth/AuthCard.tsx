import Image from "next/image";
import type { ReactNode } from "react";
export const inputClass = "mt-2 w-full rounded-lg border border-slate-300 p-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100";
export const buttonClass = "w-full rounded-lg bg-[#0C2F57] p-3 font-semibold text-white disabled:opacity-50";
export default function AuthCard({title,children}:{title:string;children:ReactNode}) {
 return <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm space-y-5">
 <div className="text-center"><div className="relative mx-auto mb-4 h-24 w-60 max-w-full"><Image src="/gsla-transp-logo.png" alt="GSLA" fill sizes="240px" className="object-cover" priority /></div><h1 className="mt-2 text-base font-normal text-slate-600">{title}</h1></div>{children}</section></main>;
}
