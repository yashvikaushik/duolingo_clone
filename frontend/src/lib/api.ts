/**
 * Base API client configuration and helper functions.
 * Connects the Next.js frontend to the FastAPI backend with Bearer token authentication.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { token?: string | null }
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    };

    if (options?.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMsg =
        data?.detail || data?.message || `Request failed with status ${response.status}`;
      return {
        error: errorMsg,
        status: response.status,
      };
    }

    return {
      data: data as T,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error occurred",
      status: 500,
    };
  }
}
