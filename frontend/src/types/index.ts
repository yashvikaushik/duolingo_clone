/**
 * Shared TypeScript type definitions for the Duolingo clone frontend.
 */

export interface HealthStatus {
  status: string;
  environment: string;
  version: string;
  database: string;
}

export interface UserProfile {
  id: number;
  firebase_uid: string;
  email: string;
  username: string | null;
  display_name: string | null;
  age: number | null;
  country: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;

  // Game stats
  streak: number;
  total_xp: number;
  current_league: string | null;
  top_3_finishes: number;
  gems: number;
  hearts: number;

  // Social counts
  followers_count: number;
  following_count: number;
}

export interface UserSyncPayload {
  email?: string;
  username?: string;
  display_name?: string;
  age?: number;
  country?: string;
  avatar_url?: string;
}
