import { mockApi } from "@/lib/mock-data";
import type {
  AuditEvent,
  CriterionEvaluation,
  DashboardStats,
  Match,
  MatchDetail,
  PaginatedResponse,
  Patient,
  Trial,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (USE_MOCK) return mockApi.getDashboardStats();
    return fetchApi<DashboardStats>("/dashboard/stats");
  },

  async getPatients(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Patient>> {
    if (USE_MOCK) return mockApi.getPatients(params);
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    return fetchApi(`/patients?${query}`);
  },

  async getPatient(id: string): Promise<Patient | null> {
    if (USE_MOCK) return mockApi.getPatient(id);
    try {
      return await fetchApi<Patient>(`/patients/${id}`);
    } catch {
      return null;
    }
  },

  async getTrials(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Trial>> {
    if (USE_MOCK) return mockApi.getTrials(params);
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    return fetchApi(`/trials?${query}`);
  },

  async getTrial(id: string): Promise<Trial | null> {
    if (USE_MOCK) return mockApi.getTrial(id);
    try {
      return await fetchApi<Trial>(`/trials/${id}`);
    } catch {
      return null;
    }
  },

  async getMatches(params?: {
    patientId?: string;
    trialId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Match>> {
    if (USE_MOCK) return mockApi.getMatches(params);
    const query = new URLSearchParams();
    if (params?.patientId) query.set("patientId", params.patientId);
    if (params?.trialId) query.set("trialId", params.trialId);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    return fetchApi(`/matches?${query}`);
  },

  async getMatch(id: string): Promise<MatchDetail | null> {
    if (USE_MOCK) return mockApi.getMatch(id);
    try {
      return await fetchApi<MatchDetail>(`/matches/${id}`);
    } catch {
      return null;
    }
  },

  async getCriteria(matchId: string): Promise<{ data: CriterionEvaluation[] }> {
    if (USE_MOCK) return mockApi.getCriteria(matchId);
    return fetchApi(`/matches/${matchId}/criteria`);
  },

  async getMatchAudit(
    matchId: string,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<AuditEvent>> {
    if (USE_MOCK) return mockApi.getMatchAudit(matchId, page, limit);
    return fetchApi(`/matches/${matchId}/audit?page=${page}&limit=${limit}`);
  },

  async getGlobalAudit(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<AuditEvent>> {
    if (USE_MOCK) return mockApi.getGlobalAudit(page, limit);
    return fetchApi(`/audit?page=${page}&limit=${limit}`);
  },
};
