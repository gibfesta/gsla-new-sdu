import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import PasswordForm from "@/components/auth/PasswordForm";
export default function ChangePasswordPage(){return <AuthCard title="Change your password"><PasswordForm change/><Link href="/facilities/home" className="block text-center text-sm text-blue-700 underline">Back to the app</Link></AuthCard>;}
