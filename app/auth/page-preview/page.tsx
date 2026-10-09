import AuthCard from "@/components/auth/AuthCard";
import PasswordForm from "@/components/auth/PasswordForm";
export default async function AccountPreview({searchParams}:{searchParams:Promise<{page?:string}>}){const {page}=await searchParams;const change=page==="change-password";return <AuthCard title={change?"Change your password":"Set your password"}><PasswordForm change={change} preview/><p className="text-center text-xs text-slate-500">Design preview · password changes are disabled.</p></AuthCard>;}
