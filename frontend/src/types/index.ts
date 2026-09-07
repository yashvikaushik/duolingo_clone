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
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSyncPayload {
  email?: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
}
