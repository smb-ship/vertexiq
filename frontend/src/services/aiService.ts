const API_BASE_URL = import.meta.env.VITE_API_URL || "https://smbship1.pythonanywhere.com";

interface Kpi {
  label: string;
  value: string;
  change: number;
}

export async function fetchAiSummary(kpis: Kpi[]): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kpis }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI summary");
  }

  const data = await response.json();
  return data.summary;
}

export async function fetchAiRecommendations(kpis: Kpi[]): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/ai/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kpis }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI recommendations");
  }

  const data = await response.json();
  return data.recommendations;
}

export interface TrendResult {
  trend: string;
  direction: "up" | "down" | "flat";
  confidence: "high" | "medium" | "low";
}

export interface Anomaly {
  title: string;
  description: string;
}

export async function fetchTrends(token: string | null): Promise<TrendResult> {
  const response = await fetch(`${API_BASE_URL}/api/ai/trends`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Failed to fetch trend analysis");
  return response.json();
}

export async function fetchAnomalies(token: string | null): Promise<Anomaly[]> {
  const response = await fetch(`${API_BASE_URL}/api/ai/anomalies`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Failed to fetch anomaly detection");
  const data = await response.json();
  return data.anomalies;
}

export async function askVertexIQ(question: string, token: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to get an answer");
  }
  const data = await response.json();
  return data.answer;
}

export async function fetchExecutiveReport(token: string | null): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/report`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Failed to generate report");
  const data = await response.json();
  return data.report;
}

export interface ForecastPoint {
  month: string;
  projected_revenue: number;
}

export async function fetchForecast(token: string | null): Promise<ForecastPoint[]> {
  const response = await fetch(`${API_BASE_URL}/api/ai/forecast`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Failed to generate forecast");
  const data = await response.json();
  return data.forecast;
}