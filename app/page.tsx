"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
export default function Home(){const router=useRouter();useEffect(()=>{const url=new URL(window.location.href);if(url.hash||url.searchParams.has("code")||url.searchParams.has("token_hash")||url.searchParams.has("error")){window.location.replace("/set-password"+url.search+url.hash);}else{router.replace("/organisation/home");}},[router]);return <AuthCard title="Checking your account link"><p role="status" className="text-center text-sm text-slate-500">Please wait…</p></AuthCard>;}
