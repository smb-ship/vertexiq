import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, AlertCircle } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { useAuth } from "../../lib/AuthContext";
import { fetchTrends, fetchAnomalies } from "../../services/aiService";

const directionConfig = {
  up: { icon: TrendingUp, color: "success" },
  down: { icon: TrendingDown, color: "danger" },
  flat: { icon: Minus, color: "text-muted" },
};

export default function TrendAnomalyPanel() {
  const { token } = useAuth();

  const trendQuery = useQuery({
    queryKey: ["ai-trends"],
    queryFn: () => fetchTrends(token),
    enabled: !!token,
    staleTime: 10 * 60 * 1000,
  });

  const anomalyQuery = useQuery({
    queryKey: ["ai-anomalies"],
    queryFn: () => fetchAnomalies(token),
    enabled: !!token,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-base font-semibold text-text-primary mb-5">Trend & Anomaly Detection</h3>

      <div className="mb-5">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Trend</p>
        {trendQuery.isLoading && <Skeleton className="h-10 w-full" />}
        {trendQuery.isError && (
          <div className="flex items-center gap-2 text-sm text-danger">
            <AlertCircle size={14} />
            Couldn't analyze trends.
          </div>
        )}
        {trendQuery.data && (
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle">
            {(() => {
              const config = directionConfig[trendQuery.data.direction];
              const Icon = config.icon;
              return <Icon size={16} className={`text-${config.color} mt-0.5 shrink-0`} />;
            })()}
            <div>
              <p className="text-sm text-text-primary leading-relaxed">{trendQuery.data.trend}</p>
              <p className="text-xs text-text-muted mt-1 capitalize">{trendQuery.data.confidence} confidence</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Anomalies</p>
        {anomalyQuery.isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {anomalyQuery.isError && (
          <div className="flex items-center gap-2 text-sm text-danger">
            <AlertCircle size={14} />
            Couldn't detect anomalies.
          </div>
        )}
        {anomalyQuery.data && anomalyQuery.data.length === 0 && (
          <p className="text-sm text-text-muted">No unusual patterns detected.</p>
        )}
        {anomalyQuery.data && anomalyQuery.data.length > 0 && (
          <div className="space-y-2">
            {anomalyQuery.data.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-warning/[0.06] border border-warning/15">
                <AlertTriangle size={14} className="text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{a.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}