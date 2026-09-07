"use client";

import { AuthProvider } from "@/context/AuthContext";
import React, { ReactNode } from "react";

export function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
