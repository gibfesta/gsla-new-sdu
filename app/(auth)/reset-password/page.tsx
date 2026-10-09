"use client";
import {useEffect} from "react";
import AuthCard from "@/components/auth/AuthCard";
export default function ResetPasswordPage(){useEffect(()=>{window.location.replace("/set-password"+window.location.search+window.location.hash);},[]);return <AuthCard title="Checking your account link"><p role="status" className="text-center text-sm text-slate-500">Please wait…</p></AuthCard>;}
