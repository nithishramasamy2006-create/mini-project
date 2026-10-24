// ── API Service — connects frontend to MongoDB via Express backend ──

export const BASE = 'http://localhost:5000/api';

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── Generic hook: tries API, falls back to static data ──
export async function fetchWithFallback<T>(
  apiFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const data = await apiFn();
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export const api = {
  projects: {
    getAll: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI<any[]>(`/projects${q}`);
    },
    getById: (id: number) => fetchAPI<any>(`/projects/${id}`),
  },
  courses: {
    getAll: (category?: string) => {
      const q = category && category !== 'all' ? `?category=${category}` : '';
      return fetchAPI<any[]>(`/courses${q}`);
    },
  },
  internships: {
    getAll: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI<any[]>(`/internships${q}`);
    },
  },
  mentors: {
    getAll: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI<any[]>(`/mentors${q}`);
    },
  },
  leaderboard: {
    getAll: () => fetchAPI<any[]>('/leaderboard'),
  },
  auth: {
    updateProfile: (fields: Record<string, any>, token: string) =>
      fetch(`${BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(fields),
      }).then(r => r.json()),
  },
  applications: {
    /** Update status of an application (company / college / admin).
     *  Triggers a branded email alert to the student automatically. */
    updateStatus: (
      appId: string,
      status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'hired' | 'accepted' | 'rejected',
      token: string,
      notes?: string,
    ) =>
      fetch(`${BASE}/applications/${appId}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status, notes }),
      }).then(r => r.json()),

    /** Company-portal status update (uses /company/applications/:id) */
    companyUpdateStatus: (
      appId: string,
      status: string,
      token: string,
      notes?: string,
    ) =>
      fetch(`${BASE}/company/applications/${appId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status, notes }),
      }).then(r => r.json()),
  },
  health: () => fetchAPI<{ status: string }>('/health'),
};
