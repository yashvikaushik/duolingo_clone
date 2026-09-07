import React from "react";
import { DuoMascot } from "./DuoMascot";

export function LoadingScreen({ message = "LOADING..." }: { message?: string }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#131f24",
        color: "#ffffff",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <DuoMascot size={130} animated={true} />
        <span className="text-sm font-black tracking-widest text-[#8496a0] uppercase select-none">
          {message}
        </span>
      </div>
    </div>
  );
}
