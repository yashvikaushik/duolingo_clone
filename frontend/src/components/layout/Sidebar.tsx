"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { dbUser, logout } = useAuth();

  const navItems = [
    { href: "/learn", label: "LEARN", icon: "🏠" },
    { href: "/leaderboards", label: "LEADERBOARDS", icon: "🛡️" },
    { href: "/quests", label: "QUESTS", icon: "📋" },
    { href: "/shop", label: "SHOP", icon: "🛒" },
    { href: "/profile", label: "PROFILE", icon: "👤" },
  ];

  return (
    <aside className="duo-sidebar" id="main-sidebar">
      {/* Logo */}
      <div className="duo-sidebar-logo">
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
          <rect rx="8" width="40" height="40" fill="#58cc02" />
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#fff"
            fontSize="22"
            fontWeight="900"
            fontFamily="sans-serif"
          >
            d
          </text>
        </svg>
        <span className="duo-sidebar-title">duolingo</span>
      </div>

      {/* Navigation items */}
      <nav className="duo-sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`duo-sidebar-item ${isActive ? "duo-sidebar-item-active" : ""}`}
              id={`sidebar-${item.label.toLowerCase()}`}
            >
              <span className="duo-sidebar-icon">{item.icon}</span>
              <span className="duo-sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="duo-sidebar-footer">
        {dbUser && (
          <div className="duo-sidebar-user">
            <div className="duo-sidebar-avatar">
              {dbUser.avatar_url ? (
                <img
                  src={dbUser.avatar_url}
                  alt={dbUser.display_name || "User"}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="duo-avatar-placeholder">
                  {(dbUser.display_name || dbUser.email)?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <span className="duo-sidebar-username">
              {dbUser.display_name || dbUser.username || dbUser.email?.split("@")[0]}
            </span>
          </div>
        )}
        <button
          onClick={logout}
          className="duo-sidebar-logout"
          id="logout-btn"
        >
          🚪 LOG OUT
        </button>
      </div>
    </aside>
  );
}
