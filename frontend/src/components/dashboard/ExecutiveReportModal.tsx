import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertCircle, TrendingUp } from "lucide-react";
import Modal from "../ui/Modal";
import Skeleton from "../ui/Skeleton";
import { useAuth } from "../../lib/AuthContext";
import { fetchExecutiveReport, fetchForecast } from "../../services/aiService";

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExecutiveReportModal({ isOpen, onClose }: ExecutiveReportModalProps) {
  const { token } = useAuth();

  const reportQuery = useQuery({
    queryKey: ["ai-report"],
    queryFn: () => fetchExecutiveReport(token),
    enabled: isOpen && !!token,
    staleTime: 10 * 60 * 1000,
  });

  const forecastQuery = useQuery({
    queryKey: ["ai-forecast"],
    queryFn: () => fetchForecast(token),
    enabled: isOpen && !!token,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Executive Report">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto">
        {reportQuery.isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {reportQuery.isError && (
          <div className="flex items-center gap-2 text-sm text-danger">
            <AlertCircle size={14} />
            Couldn't generate report.
          </div>
        )}
        {reportQuery.data && (
          <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
            {reportQuery.data}
          </div>
        )}

        <div className="pt-4 border-t border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
            <TrendingUp size={12} />
            AI-Estimated 3-Month Forecast
          </div>

          {forecastQuery.isLoading && <Skeleton className="h-[160px] w-full" />}
          {forecastQuery.data && forecastQuery.data.length > 0 && (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={forecastQuery.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Line
                  type="monotone"
                  dataKey="projected_revenue"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#60A5FA", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          <p className="text-xs text-text-muted mt-2">
            Estimated by AI based on historical trend — not a statistical guarantee.
          </p>
        </div>
      </div>
    </Modal>
  );
}