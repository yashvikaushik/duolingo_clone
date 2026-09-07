/**
 * Shared TypeScript type definitions for the frontend application.
 */

export interface HealthStatus {
  status: string;
  environment: string;
  version: string;
  database: string;
}
