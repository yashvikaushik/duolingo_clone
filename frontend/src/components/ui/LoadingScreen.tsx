import React from "react";
import { DuoMascot } from "./DuoMascot";

export function LoadingScreen({ message = "LOADING..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#131f24] text-white">
      <div className="flex flex-col items-center gap-6">
        <DuoMascot size={130} animated={true} />
        <span className="text-sm font-black tracking-widest text-[#8496a0] uppercase select-none">
          {message}
        </span>
      </div>
    </div>
  );
}
