const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Analyst";
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Login failed");
  }

  return response.json();
}