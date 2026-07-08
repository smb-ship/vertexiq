import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./lib/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./components/dashboard/DashboardPage";
import AnalyticsPage from "./components/dashboard/AnalyticsPage";
import InsightsPage from "./components/dashboard/InsightsPage";
import SettingsPage from "./components/dashboard/SettingsPage";
import TeamPage from "./components/dashboard/TeamPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="team" element={<TeamPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}