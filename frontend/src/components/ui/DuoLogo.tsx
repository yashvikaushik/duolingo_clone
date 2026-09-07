import React from "react";

export function DuoLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-black text-2xl tracking-tight select-none ${className}`}>
      {/* Duolingo Mascot Icon */}
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4C14 4 6 12 6 23C6 32 12 39 20 42V44C20 45.1 20.9 46 22 46H26C27.1 46 28 45.1 28 44V42C36 39 42 32 42 23C42 12 34 4 24 4Z"
          fill="#58CC02"
        />
        {/* Face circle */}
        <circle cx="17" cy="22" r="7" fill="#FFFFFF" />
        <circle cx="31" cy="22" r="7" fill="#FFFFFF" />
        {/* Pupils */}
        <circle cx="17" cy="22" r="4" fill="#4B4B4B" />
        <circle cx="31" cy="22" r="4" fill="#4B4B4B" />
        <circle cx="18" cy="20.5" r="1.5" fill="#FFFFFF" />
        <circle cx="32" cy="20.5" r="1.5" fill="#FFFFFF" />
        {/* Beak */}
        <path
          d="M21 26C21 28.5 24 31 24 31C24 31 27 28.5 27 26H21Z"
          fill="#FF9600"
        />
      </svg>
      <span style={{ color: "#58cc02" }}>duolingo</span>
    </div>
  );
}
