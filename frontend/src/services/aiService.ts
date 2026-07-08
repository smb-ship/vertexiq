const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

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