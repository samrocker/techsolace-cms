
"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import Sidebar from "./sidebar";

const Applayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const token = getAccessToken()

  useEffect(() => {
    if(!token) {
      router.push('/login')
    }
  }, [])

  return (
    <div className="h-screen w-full flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default Applayout;
