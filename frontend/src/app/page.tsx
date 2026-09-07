"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { DuoMascot } from "@/components/ui/DuoMascot";

export default function HomePage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to profile safely inside useEffect
  useEffect(() => {
    if (!loading && firebaseUser) {
      router.push("/profile");
    }
  }, [loading, firebaseUser, router]);

  if (loading) return <LoadingScreen message="LOADING..." />;
  if (firebaseUser) return <LoadingScreen message="LOADING..." />;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#131f24" }}>
      {/* Top bar */}
      <nav className="flex items-center justify-end px-5 py-4 gap-3">
        <button
          onClick={() => router.push("/login")}
          className="duo-btn-outline px-5 py-2 text-sm"
          id="home-login-btn"
        >
          LOG IN
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <DuoMascot size={180} />

        <h1
          className="text-center font-extrabold text-4xl mt-8 mb-3"
          style={{ color: "#ffffff", lineHeight: 1.2 }}
        >
          The free, fun, and effective<br />
          way to learn a language!
        </h1>

        <p
          className="text-center text-lg mb-10 max-w-md"
          style={{ color: "#8496a0" }}
        >
          Learning with Duolingo is fun and addictive. Earn points for correct
          answers, race against the clock, and level up.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => router.push("/signup")}
            className="duo-btn-green w-full py-3.5 text-base"
            id="home-getstarted-btn"
          >
            GET STARTED
          </button>
          <button
            onClick={() => router.push("/login")}
            className="duo-btn-outline w-full py-3.5 text-base"
            id="home-already-account-btn"
          >
            I ALREADY HAVE AN ACCOUNT
          </button>
        </div>
      </main>
    </div>
  );
}
