import React from "react";

export function DuoMascot({ size = 120, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none">
      {/* Musical notes if animated */}
      {animated && (
        <div className="absolute -top-6 flex justify-between w-full px-2 pointer-events-none">
          <span className="animate-note-1 text-sky-400 font-bold text-xl">♪</span>
          <span className="animate-note-2 text-sky-400 font-bold text-xl ml-6">♫</span>
        </div>
      )}

      {/* Mascot Body SVG */}
      <div className={animated ? "animate-duo-dance" : ""}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Owl Body */}
          <path
            d="M50 10C30 10 16 26 16 48C16 68 28 82 42 88L40 94C40 95.5 41.5 97 43 97H57C58.5 97 60 95.5 60 94L58 88C72 82 84 68 84 48C84 26 70 10 50 10Z"
            fill="#58CC02"
          />
          {/* Wings */}
          <path
            d="M16 48C12 40 4 45 10 58C14 66 22 68 24 64C22 58 18 53 16 48Z"
            fill="#46A302"
          />
          <path
            d="M84 48C88 40 96 45 90 58C86 66 78 68 76 64C78 58 82 53 84 48Z"
            fill="#46A302"
          />
          {/* Belly patch */}
          <path
            d="M50 56C38 56 34 68 34 78C34 83 41 87 50 87C59 87 66 83 66 78C66 68 62 56 50 56Z"
            fill="#79E01E"
          />
          {/* Eyes Background */}
          <circle cx="36" cy="42" r="14" fill="#FFFFFF" />
          <circle cx="64" cy="42" r="14" fill="#FFFFFF" />
          {/* Pupils */}
          <circle cx="36" cy="42" r="8" fill="#18272F" />
          <circle cx="64" cy="42" r="8" fill="#18272F" />
          {/* Eye Highlights */}
          <circle cx="39" cy="39" r="3.5" fill="#FFFFFF" />
          <circle cx="67" cy="39" r="3.5" fill="#FFFFFF" />
          {/* Beak */}
          <path
            d="M44 50C44 55 50 60 50 60C50 60 56 55 56 50H44Z"
            fill="#FF9600"
          />
          {/* Feet */}
          <ellipse cx="40" cy="94" rx="7" ry="3.5" fill="#FF9600" />
          <ellipse cx="60" cy="94" rx="7" ry="3.5" fill="#FF9600" />
        </svg>
      </div>

      {/* Shadow underneath */}
      <div
        className="w-16 h-3.5 bg-black/40 rounded-full mt-1 blur-[1px]"
        style={{ width: size * 0.65 }}
      />
    </div>
  );
}
