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
    { href: "/sounds", label: "SOUNDS", icon: "👄" },
    { href: "/leaderboards", label: "LEADERBOARDS", icon: "🛡️" },
    { href: "/quests", label: "QUESTS", icon: "🎁" },
    { href: "/shop", label: "SHOP", icon: "🏪" },
    { href: "/profile", label: "PROFILE", icon: "👤" },
    { href: "/more", label: "MORE", icon: "💬" },
  ];

  return (
    <aside className="duo-sidebar" id="main-sidebar">
      {/* Logo */}
      <Link href="/profile" className="duo-sidebar-logo">
        <span className="duo-sidebar-title">duolingo</span>
      </Link>

      {/* Navigation items */}
      <nav className="duo-sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/profile");
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

      {/* Bottom logout section */}
      <div className="duo-sidebar-footer">
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
