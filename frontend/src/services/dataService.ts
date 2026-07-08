const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export interface RevenuePoint {
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

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json();
}

export const fetchRevenueData = () => fetchJson<RevenuePoint[]>("/api/dashboard/revenue");
export const fetchTrafficData = () => fetchJson<TrafficPoint[]>("/api/analytics/traffic");
export const fetchTeamData = () => fetchJson<TeamMemberData[]>("/api/team");