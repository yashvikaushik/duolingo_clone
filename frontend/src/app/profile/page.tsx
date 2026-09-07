"use client";

import React, { useState, FormEvent } from "react";
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

  // Redirect to login safely inside useEffect if not authenticated
  React.useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [loading, firebaseUser, router]);

  if (loading || !firebaseUser) {
    return <LoadingScreen />;
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
    : "—";

  return (
    <div className="duo-app-layout">
      <Sidebar />
      <main className="duo-main-content">
        <div className="duo-profile-container" id="profile-page">
          {/* Profile Header */}
          <div className="duo-profile-header">
            <div className="duo-profile-avatar-lg">
              {dbUser?.avatar_url ? (
                <img
                  src={dbUser.avatar_url}
                  alt={dbUser.display_name || "User"}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <div className="duo-avatar-placeholder-lg">
                  {(dbUser?.display_name || dbUser?.email)?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="duo-profile-info">
              <h1 className="duo-profile-name">
                {dbUser?.display_name || dbUser?.username || dbUser?.email?.split("@")[0] || "Learner"}
              </h1>
              {dbUser?.username && (
                <p className="duo-profile-username">@{dbUser.username}</p>
              )}
              <p className="duo-profile-joined">
                📅 Joined {joinDate}
              </p>
            </div>

            {!isEditing && (
              <button
                className="duo-btn-outline px-5 py-2.5 text-sm"
                onClick={openEdit}
                id="edit-profile-btn"
              >
                EDIT PROFILE
              </button>
            )}
          </div>

          {/* Save message */}
          {saveMsg && (
            <div
              className="text-center text-sm font-semibold px-4 py-3 rounded-xl mb-4"
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

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSave} className="duo-profile-edit-form">
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

          {/* Stats Cards */}
          <div className="duo-stats-grid">
            <div className="duo-stat-card">
              <span className="duo-stat-icon">🔥</span>
              <div>
                <div className="duo-stat-value">0</div>
                <div className="duo-stat-label">Day streak</div>
              </div>
            </div>
            <div className="duo-stat-card">
              <span className="duo-stat-icon">⚡</span>
              <div>
                <div className="duo-stat-value">0</div>
                <div className="duo-stat-label">Total XP</div>
              </div>
            </div>
            <div className="duo-stat-card">
              <span className="duo-stat-icon">🏆</span>
              <div>
                <div className="duo-stat-value">—</div>
                <div className="duo-stat-label">Current league</div>
              </div>
            </div>
            <div className="duo-stat-card">
              <span className="duo-stat-icon">🥇</span>
              <div>
                <div className="duo-stat-value">0</div>
                <div className="duo-stat-label">Top 3 finishes</div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="duo-profile-section">
            <h2 className="duo-section-title">Account Details</h2>
            <div className="duo-detail-row">
              <span className="duo-detail-label">Email</span>
              <span className="duo-detail-value">{dbUser?.email || firebaseUser.email || "—"}</span>
            </div>
            <div className="duo-detail-row">
              <span className="duo-detail-label">User ID</span>
              <span className="duo-detail-value" style={{ fontSize: "0.75rem" }}>
                {dbUser?.firebase_uid || "—"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
