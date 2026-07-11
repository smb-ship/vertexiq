const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export interface RevenuePoint {
  id: number;
  month: string;
  revenue: number;
}

export interface TrafficPoint {
  source: string;
  visits: number;
}

export interface TeamMemberData {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Analyst";
  status: "Active" | "Away" | "Offline";
  avatarInitial: string;
}

async function fetchJson<T>(path: string, token?: string | null): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json();
}

export const fetchRevenueData = (token: string | null) => fetchJson<RevenuePoint[]>("/api/dashboard/revenue", token);
export const fetchTrafficData = () => fetchJson<TrafficPoint[]>("/api/analytics/traffic");
export const fetchTeamData = (token: string | null) =>fetchJson<TeamMemberData[]>("/api/team", token);

export interface CreateTeamMemberInput {
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Analyst";
  status: "Active" | "Away" | "Offline";
}

export async function createTeamMember(input: CreateTeamMemberInput, token: string): Promise<TeamMemberData> {
  const response = await fetch(`${API_BASE_URL}/api/team`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create team member");
  }
  return response.json();
}

export async function updateTeamMember(
  id: number,
  input: Partial<CreateTeamMemberInput>,
  token: string
): Promise<TeamMemberData> {
  const response = await fetch(`${API_BASE_URL}/api/team/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update team member");
  }
  return response.json();
}

export async function deleteTeamMember(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/team/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete team member");
  }
}

export async function createRevenuePoint(
  input: { month: string; revenue: number },
  token: string
): Promise<RevenuePoint> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/revenue`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create revenue record");
  }
  return response.json();
}

export async function updateRevenuePoint(
  id: number,
  input: Partial<{ month: string; revenue: number }>,
  token: string
): Promise<RevenuePoint> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/revenue/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update revenue record");
  }
  return response.json();
}

export async function deleteRevenuePoint(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/revenue/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete revenue record");
  }
}

export interface NotificationData {
  id: number;
  message: string;
  unread: boolean;
  time: string;
}

export const fetchNotifications = (token: string | null) =>
  fetchJson<NotificationData[]>("/api/notifications", token);

export async function markNotificationRead(id: number, token: string): Promise<NotificationData> {
  const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ unread: false }),
  });
  if (!response.ok) throw new Error("Failed to update notification");
  return response.json();
}

export async function markAllNotificationsRead(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to mark all as read");
}

export interface KpiFromApi {
  id: number;
  label: string;
  value: string;
  change: number;
  icon: string;
  trend: number[];
}

export const fetchKpis = (token: string | null) => fetchJson<KpiFromApi[]>("/api/kpis", token);

export async function createKpi(
  input: { label: string; value: string; change: number; icon: string },
  token: string
): Promise<KpiFromApi> {
  const response = await fetch(`${API_BASE_URL}/api/kpis`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create KPI");
  }
  return response.json();
}

export async function updateKpi(
  id: number,
  input: Partial<{ label: string; value: string; change: number; icon: string }>,
  token: string
): Promise<KpiFromApi> {
  const response = await fetch(`${API_BASE_URL}/api/kpis/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update KPI");
  }
  return response.json();
}

export async function deleteKpi(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/kpis/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete KPI");
  }
}