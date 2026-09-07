"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SocialButtons } from "@/components/ui/SocialButtons";

export default function LoginPage() {
  const { loginWithEmail, loginWithGoogle, loginWithFacebook, error, clearError } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError("Please enter your email or username");
      return;
    }
    if (!password) {
      setLocalError("Please enter your password");
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithEmail(email.trim(), password);
      router.push("/profile");
    } catch {
      // error is already set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    clearError();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.push("/profile");
    } catch {
      // error is already set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebook = async () => {
    clearError();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await loginWithFacebook();
      router.push("/profile");
    } catch {
      // error is already set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#131f24" }}>
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="text-2xl font-bold"
          style={{ color: "#5f7481" }}
          aria-label="Close"
        >
          ✕
        </Link>
        <Link
          href="/signup"
          className="duo-btn-outline px-5 py-2 text-sm"
          id="goto-signup-btn"
        >
          SIGN UP
        </Link>
      </nav>

      {/* Login Form */}
      <main className="flex-1 flex items-start justify-center pt-16 px-4 pb-8">
        <div className="w-full max-w-md">
          <h1
            className="text-center font-extrabold text-2xl mb-8"
            style={{ color: "#ffffff" }}
          >
            Log in
          </h1>

          {/* Error Display */}
          {displayError && (
            <div
              className="mb-4 text-center text-sm font-semibold px-4 py-3 rounded-xl"
              style={{
                backgroundColor: "rgba(255, 75, 75, 0.12)",
                color: "#ff4b4b",
              }}
              role="alert"
            >
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <input
              id="login-email"
              type="email"
              placeholder="Email or username"
              className={`duo-input ${localError && !email.trim() ? "duo-input-error" : ""}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLocalError(null); }}
              autoComplete="email"
              disabled={isSubmitting}
            />

            <div className="relative">
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                className={`duo-input ${localError && !password ? "duo-input-error" : ""}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLocalError(null); }}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold tracking-wider uppercase"
                style={{ color: "#1cb0f6" }}
                tabIndex={-1}
              >
                FORGOT?
              </button>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="duo-btn-blue w-full py-3.5 text-base mt-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "#37464f" }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: "#5f7481" }}>
              OR
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#37464f" }} />
          </div>

          {/* Social buttons */}
          <SocialButtons
            onGoogleClick={handleGoogle}
            onFacebookClick={handleFacebook}
            disabled={isSubmitting}
          />

          {/* Footer text */}
          <p
            className="text-center text-xs mt-8 leading-relaxed px-2"
            style={{ color: "#5f7481" }}
          >
            By signing in to Duolingo, you agree to our{" "}
            <span style={{ color: "#1cb0f6" }} className="cursor-pointer font-medium">Terms</span>{" "}
            and{" "}
            <span style={{ color: "#1cb0f6" }} className="cursor-pointer font-medium">Privacy Policy</span>.
          </p>
          <p
            className="text-center text-xs mt-3 leading-relaxed px-2"
            style={{ color: "#5f7481" }}
          >
            This site is protected by reCAPTCHA Enterprise and the Google{" "}
            <span style={{ color: "#1cb0f6" }} className="cursor-pointer font-medium">Privacy Policy</span>{" "}
            and{" "}
            <span style={{ color: "#1cb0f6" }} className="cursor-pointer font-medium">Terms of Service</span>{" "}
            apply.
          </p>
        </div>
      </main>
    </div>
  );
}
