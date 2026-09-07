"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { fetchApi } from "@/lib/api";

export default function ProfilePage() {
  const { firebaseUser, dbUser, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");

  // Safely handle unauthenticated redirect inside useEffect
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [loading, firebaseUser, router]);

  if (loading || !firebaseUser) {
    return <LoadingScreen message="LOADING..." />;
  }

  const openEdit = () => {
    setDisplayName(dbUser?.display_name || "");
    setUsername(dbUser?.username || "");
    setIsEditing(true);
    setSaveMsg(null);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetchApi("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          display_name: displayName.trim() || null,
          username: username.trim() || null,
        }),
        token,
      });

      if (res.error) {
        setSaveMsg(res.error);
      } else {
        setSaveMsg("Profile updated!");
        setIsEditing(false);
        await refreshProfile();
      }
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const joinDate = dbUser?.created_at
    ? new Date(dbUser.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "September 2026";

  const userDisplayName = dbUser?.display_name || firebaseUser.displayName || "Yashvi Kaushik";
  const userHandle = dbUser?.username || firebaseUser.email?.split("@")[0] || "YashviKaus12";

  return (
    <div className="duo-app-layout">
      {/* Left Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Dashboard */}
      <main className="duo-main-content">
        <div className="duo-dashboard-grid">
          
          {/* Middle Column (Profile & Stats) */}
          <div className="duo-center-column">
            
            {/* Top Avatar Banner Card */}
            <div className="duo-profile-banner-card" id="profile-banner">
              
              {/* Edit Pencil Button */}
              <button
                className="duo-edit-pencil-btn"
                onClick={openEdit}
                aria-label="Edit Profile"
                id="edit-profile-pencil"
              >
                ✏️
              </button>

              {/* Avatar Box */}
              <div className="duo-avatar-silhouette-box">
                {dbUser?.avatar_url || firebaseUser.photoURL ? (
                  <img
                    src={dbUser?.avatar_url || firebaseUser.photoURL || ""}
                    alt={userDisplayName}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="duo-avatar-dashed-silhouette">
                    <span>+</span>
                  </div>
                )}
              </div>

              {/* Edit Form Modal Overlay / Inline Form */}
              {isEditing && (
                <form onSubmit={handleSave} className="duo-profile-edit-form mb-6">
                  <div className="duo-form-group">
                    <label className="duo-form-label" htmlFor="edit-display-name">
                      Display Name
                    </label>
                    <input
                      id="edit-display-name"
                      type="text"
                      className="duo-input"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                      disabled={saving}
                    />
                  </div>
                  <div className="duo-form-group">
                    <label className="duo-form-label" htmlFor="edit-username">
                      Username
                    </label>
                    <input
                      id="edit-username"
                      type="text"
                      className="duo-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="duo-btn-green px-6 py-3 text-sm flex-1"
                      disabled={saving}
                      id="save-profile-btn"
                    >
                      {saving ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                    <button
                      type="button"
                      className="duo-btn-outline px-6 py-3 text-sm flex-1"
                      onClick={() => { setIsEditing(false); setSaveMsg(null); }}
                      disabled={saving}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}

              {saveMsg && (
                <div
                  className="text-center text-sm font-semibold px-4 py-2.5 rounded-xl mb-4"
                  style={{
                    backgroundColor: saveMsg.includes("updated")
                      ? "rgba(88, 204, 2, 0.12)"
                      : "rgba(255, 75, 75, 0.12)",
                    color: saveMsg.includes("updated") ? "#58cc02" : "#ff4b4b",
                  }}
                  role="status"
                >
                  {saveMsg}
                </div>
              )}

              {/* User Identity Meta Details */}
              <div className="duo-user-meta">
                <div>
                  <h1 className="duo-user-fullname">{userDisplayName}</h1>
                  <p className="duo-user-username-handle">{userHandle}</p>
                  <p className="duo-user-joined-text">Joined {joinDate}</p>

                  <div className="duo-user-social-counts">
                    <span>0 Following</span>
                    <span>0 Followers</span>
                  </div>
                </div>

                {/* Country Flag Badge */}
                <div className="text-3xl select-none" title="English (US)">
                  🇺🇸
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div>
              <h2 className="duo-section-header">Statistics</h2>
              <div className="duo-stats-2x2">
                <div className="duo-stat-card-item">
                  <span className="icon">🔥</span>
                  <div>
                    <div className="val">{dbUser?.streak_count ?? 0}</div>
                    <div className="lbl">Day streak</div>
                  </div>
                </div>

                <div className="duo-stat-card-item">
                  <span className="icon">⚡</span>
                  <div>
                    <div className="val">{dbUser?.total_xp ?? 0}</div>
                    <div className="lbl">Total XP</div>
                  </div>
                </div>

                <div className="duo-stat-card-item">
                  <span className="icon">🛡️</span>
                  <div>
                    <div className="val">None</div>
                    <div className="lbl">Current league</div>
                  </div>
                </div>

                <div className="duo-stat-card-item">
                  <span className="icon">🥇</span>
                  <div>
                    <div className="val">0</div>
                    <div className="lbl">Top 3 finishes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div>
              <div className="duo-section-header">
                <span>Achievements</span>
                <span
                  className="text-xs font-bold tracking-wider cursor-pointer"
                  style={{ color: "#1cb0f6" }}
                >
                  VIEW ALL
                </span>
              </div>

              <div className="duo-achievement-card">
                <div className="duo-achievement-badge">
                  <span>🔥</span>
                  <span>LEVEL 1</span>
                </div>
                <div className="duo-achievement-info">
                  <div className="duo-achievement-title">
                    <span>Wildfire</span>
                    <span style={{ color: "#8496a0" }}>0/3</span>
                  </div>
                  <div className="duo-progress-bar-bg">
                    <div className="duo-progress-bar-fill" style={{ width: "0%" }} />
                  </div>
                  <div className="duo-achievement-desc">
                    Reach a 3 day streak
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Top Bar & Widgets) */}
          <div className="duo-right-column">
            
            {/* Top Right Header Stats Bar */}
            <div className="duo-top-stats-bar">
              <div className="duo-stat-pill" title="Current Language">
                <span className="text-xl">🇺🇸</span>
              </div>
              <div className="duo-stat-pill active" title="Streak">
                <span className="text-lg">🔥</span>
                <span style={{ color: "#8496a0" }}>0</span>
              </div>
              <div className="duo-stat-pill active" title="Gems">
                <span className="text-lg">💎</span>
                <span style={{ color: "#1cb0f6" }}>500</span>
              </div>
              <div className="duo-stat-pill active" title="Hearts">
                <span className="text-lg">❤️</span>
                <span style={{ color: "#ff4b4b" }}>4</span>
              </div>
            </div>

            {/* Following / Followers Tab Widget */}
            <div className="duo-widget-card">
              <div className="duo-tab-header">
                <div
                  className={`duo-tab-btn ${activeTab === "following" ? "active" : ""}`}
                  onClick={() => setActiveTab("following")}
                >
                  FOLLOWING
                </div>
                <div
                  className={`duo-tab-btn ${activeTab === "followers" ? "active" : ""}`}
                  onClick={() => setActiveTab("followers")}
                >
                  FOLLOWERS
                </div>
              </div>

              <div className="duo-followers-empty">
                <div className="duo-followers-characters select-none">
                  <span>👩‍🎤</span>
                  <span>👵</span>
                  <span>🧔</span>
                  <span>👩</span>
                  <span>👴</span>
                </div>
                <p className="duo-followers-text">
                  Learning is more fun and effective when you connect with others.
                </p>
              </div>
            </div>

            {/* Add Friends Widget */}
            <div className="duo-widget-card">
              <h3
                className="font-extrabold text-base mb-3"
                style={{ color: "#ffffff" }}
              >
                Add friends
              </h3>
              <div className="duo-friends-list">
                <div className="duo-friend-item">
                  <div className="duo-friend-item-left">
                    <span className="text-xl">🔍</span>
                    <span>Find friends</span>
                  </div>
                  <span className="duo-friend-arrow">›</span>
                </div>

                <div className="duo-friend-item">
                  <div className="duo-friend-item-left">
                    <span className="text-xl">📩</span>
                    <span>Invite friends</span>
                  </div>
                  <span className="duo-friend-arrow">›</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="duo-footer-links">
              <a href="#">ABOUT</a>
              <a href="#">BLOG</a>
              <a href="#">STORE</a>
              <a href="#">EFFICACY</a>
              <a href="#">CAREERS</a>
              <a href="#">INVESTORS</a>
              <a href="#">TERMS</a>
              <a href="#">PRIVACY</a>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
