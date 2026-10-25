/**
 * KickSkill API client for interacting with the FastAPI + SQLite backend.
 */

const API_BASE = (import.meta.env?.VITE_API_URL as string) || "http://localhost:8000";

const TOKEN_KEY = "kickskill_token";
const USER_KEY = "kickskill_user";

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface ProfileData {
  name: string;
  email: string;
  institution?: string | null;
  degree?: string | null;
  branch?: string | null;
  graduation_year?: string | null;
  career_goal?: string | null;
  target_role?: string | null;
  current_skills: string[];
}

export interface RoadmapStep {
  title: string;
  description: string;
  skills: string[];
  duration_weeks: number;
}

export interface RoadmapData {
  target_role: string;
  steps: RoadmapStep[];
}

export interface OpportunityItem {
  id: number;
  title: string;
  company: string;
  location: string;
  mode: string;
  match: number;
  skills: string[];
  skillGap: string[];
  about: string;
  responsibilities: string[];
  eligibility: string;
  deadline: string;
  whyMatch: string;
  stipend: string;
}

export type ApplicationStatus =
  | "submitted"
  | "resume_viewed"
  | "shortlisted"
  | "interview"
  | "offer"
  | "rejected";

export interface ApplicationItem {
  id: number;
  opportunity_id: number;
  role: string;
  company: string;
  companyInitial: string;
  accentColor: string;
  date: string;
  match: number;
  status: ApplicationStatus;
  location: string;
  stipend: string;
  jobType: string;
  notes?: string | null;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatStreamOptions {
  messages: ChatMessage[];
  pageContext?: string;
  onChunk: (chunk: string) => void;
  onDone?: () => void;
  onError?: (err: Error) => void;
  signal?: AbortSignal;
}

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Ignore storage issues
  }
}

export function clearAuth(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Ignore storage issues
  }
}

export function getCachedUser(): UserResponse | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedUser(user: UserResponse): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage issues
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = new Headers(options.headers || {});

  const token = getToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, { credentials: "omit", ...options, headers });
    if (!res.ok) {
      let errData = null;
      try {
        errData = await res.json();
      } catch {
        // Not JSON
      }
      const message = errData?.detail || `API request failed with status ${res.status}`;
      throw new ApiError(message, res.status, errData);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || "Failed to reach backend service", 0);
  }
}

export const api = {
  auth: {
    async login(email: string, name?: string): Promise<AuthResponse> {
      const data = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, name }),
      });
      setToken(data.access_token);
      setCachedUser(data.user);
      return data;
    },

    async signup(email: string, name?: string): Promise<AuthResponse> {
      const data = await apiFetch<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, name }),
      });
      setToken(data.access_token);
      setCachedUser(data.user);
      return data;
    },

    async getMe(): Promise<UserResponse> {
      const user = await apiFetch<UserResponse>("/auth/me");
      setCachedUser(user);
      return user;
    },

    logout(): void {
      clearAuth();
    },

    isAuthenticated(): boolean {
      return Boolean(getToken());
    },
  },

  profile: {
    async getMe(): Promise<ProfileData> {
      return apiFetch<ProfileData>("/profile/me");
    },

    async updateMe(data: Partial<ProfileData>): Promise<ProfileData> {
      return apiFetch<ProfileData>("/profile/me", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    async getPublic(userId: string): Promise<ProfileData> {
      return apiFetch<ProfileData>(`/profile/${userId}`);
    },
  },

  opportunities: {
    async list(params?: { q?: string; mode?: string; tab?: string; min_match?: number }): Promise<OpportunityItem[]> {
      const query = new URLSearchParams();
      if (params?.q) query.set("q", params.q);
      if (params?.mode) query.set("mode", params.mode);
      if (params?.tab) query.set("tab", params.tab);
      if (params?.min_match !== undefined) query.set("min_match", String(params.min_match));
      const qs = query.toString();
      return apiFetch<OpportunityItem[]>(`/opportunities${qs ? `?${qs}` : ""}`);
    },

    async get(id: number): Promise<OpportunityItem> {
      return apiFetch<OpportunityItem>(`/opportunities/${id}`);
    },
  },

  applications: {
    async list(status?: string): Promise<ApplicationItem[]> {
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      return apiFetch<ApplicationItem[]>(`/applications${qs}`);
    },

    async apply(opportunityId: number, notes?: string): Promise<ApplicationItem> {
      return apiFetch<ApplicationItem>("/applications", {
        method: "POST",
        body: JSON.stringify({ opportunity_id: opportunityId, notes }),
      });
    },

    async updateStatus(id: number, status: string): Promise<ApplicationItem> {
      return apiFetch<ApplicationItem>(`/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
  },

  roadmap: {
    async getMe(): Promise<RoadmapData> {
      return apiFetch<RoadmapData>("/roadmap/me");
    },

    async generate(data?: { target_role?: string; current_skills?: string[] }): Promise<RoadmapData> {
      return apiFetch<RoadmapData>("/roadmap/generate", {
        method: "POST",
        body: JSON.stringify(data || {}),
      });
    },
  },

  health: {
    async check(): Promise<{ status: string; database?: string; version?: string }> {
      return apiFetch<{ status: string; database?: string; version?: string }>("/health");
    },
  },

  chat: {
    async stream(options: ChatStreamOptions): Promise<string> {
      const url = `${API_BASE}/chat`;
      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: options.messages,
          page_context: options.pageContext,
        }),
        signal: options.signal,
      });

      if (!res.ok) {
        let errMsg = `Chat request failed: ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.detail) errMsg = errData.detail;
        } catch {
          // non-json error body
        }
        const error = new Error(errMsg);
        options.onError?.(error);
        throw error;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        const error = new Error("No readable stream response from chat service");
        options.onError?.(error);
        throw error;
      }

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === "[DONE]") {
              options.onDone?.();
              return fullText;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;
                options.onChunk(parsed.text);
              }
            } catch {
              // partial chunk
            }
          }
        }
      } catch (err: any) {
        if (options.signal?.aborted) {
          return fullText;
        }
        options.onError?.(err);
        throw err;
      }

      options.onDone?.();
      return fullText;
    },
  },
};
