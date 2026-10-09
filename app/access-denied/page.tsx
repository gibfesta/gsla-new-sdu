import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
export default function AccessDeniedPage(){return <AuthCard title="Access restricted"><p className="text-sm text-slate-600">Your account does not have permission to view this department. Contact your GSLA administrator if you believe this is incorrect.</p><Link href="/sign-in" className="block text-center text-sm text-blue-700 underline">Return to sign in</Link></AuthCard>;}
