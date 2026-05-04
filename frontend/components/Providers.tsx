"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "./Toast";
import { CommandPalette } from "./CommandPalette";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <CommandPalette />
      <ToastContainer />
    </AuthProvider>
  );
}
