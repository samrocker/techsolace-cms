"use client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAccessToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const HomePage = () => {
  const token = getAccessToken();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/dashboard");
  }, []);

  return (
    <div className="h-screen w-full flex-center">
      <LoadingSpinner className="h-10 w-10" />
    </div>
  );
};

export default HomePage;
