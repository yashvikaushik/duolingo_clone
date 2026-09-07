"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SocialButtons } from "@/components/ui/SocialButtons";
import { DuoMascot } from "@/components/ui/DuoMascot";

export default function SignupPage() {
  const { signupWithEmail, loginWithGoogle, loginWithFacebook, error, clearError } = useAuth();
  const router = useRouter();

  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"info" | "credentials">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInfoStep = (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!age.trim()) {
      setLocalError("What's your age?");
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 4 || ageNum > 120) {
      setLocalError("Please enter a valid age");
      return;
    }
    if (!name.trim()) {
      setLocalError("What's your name?");
      return;
    }
    setStep("credentials");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setLocalError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setLocalError("Please create a password");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await signupWithEmail(email.trim(), password, name.trim());
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
      console.log("[SignupPage] Google authentication requested");
      await loginWithGoogle();
      console.log("[SignupPage] Google auth succeeded, navigating to /profile");
      router.push("/profile");
    } catch (err: any) {
      console.error("[SignupPage] Google authentication error:", err);
      setLocalError(err.message || "Google sign-in failed. Please try again.");
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
          href="/login"
          className="duo-btn-outline px-5 py-2 text-sm"
          id="goto-login-btn"
        >
          LOG IN
        </Link>
      </nav>

      <main className="flex-1 flex items-start justify-center pt-8 px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Mascot */}
          <div className="flex justify-center mb-6">
            <DuoMascot size={100} />
          </div>

          <h1
            className="text-center font-extrabold text-2xl mb-8"
            style={{ color: "#ffffff" }}
          >
            {step === "info" ? "Create your profile" : "Create your account"}
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

          {step === "info" ? (
            <form onSubmit={handleInfoStep} className="flex flex-col gap-4" noValidate>
              <input
                id="signup-age"
                type="number"
                placeholder="Age"
                className={`duo-input ${localError && !age.trim() ? "duo-input-error" : ""}`}
                value={age}
                onChange={(e) => { setAge(e.target.value); setLocalError(null); }}
                autoComplete="off"
                min={4}
                max={120}
              />
              <input
                id="signup-name"
                type="text"
                placeholder="Name (optional for display)"
                className={`duo-input ${localError && localError.includes("name") && !name.trim() ? "duo-input-error" : ""}`}
                value={name}
                onChange={(e) => { setName(e.target.value); setLocalError(null); }}
                autoComplete="name"
              />

              <button
                type="submit"
                className="duo-btn-green w-full py-3.5 text-base mt-1"
              >
                NEXT
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <input
                id="signup-email"
                type="email"
                placeholder="Email"
                className={`duo-input ${localError && !email.trim() ? "duo-input-error" : ""}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLocalError(null); }}
                autoComplete="email"
                disabled={isSubmitting}
              />
              <input
                id="signup-password"
                type="password"
                placeholder="Password"
                className={`duo-input ${localError && !password ? "duo-input-error" : ""}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLocalError(null); }}
                autoComplete="new-password"
                disabled={isSubmitting}
              />

              <button
                type="submit"
                id="signup-submit-btn"
                className="duo-btn-green w-full py-3.5 text-base mt-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>

              <button
                type="button"
                className="text-sm font-bold tracking-wider"
                style={{ color: "#1cb0f6" }}
                onClick={() => { setStep("info"); setLocalError(null); clearError(); }}
              >
                ← BACK
              </button>
            </form>
          )}

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
