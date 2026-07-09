import { useNavigate } from "react-router-dom";
import { Sparkles, AlertCircle, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "../ui/Skeleton";
import { fetchAiSummary } from "../../services/aiService";

interface AiSummaryPanelProps {
  kpis: { label: string; value: string; change: number }[];
}

export default function AiSummaryPanel({ kpis }: AiSummaryPanelProps) {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ai-summary", kpis],
    queryFn: () => fetchAiSummary(kpis),
    staleTime: 5 * 60 * 1000,
  });

  const primaryDriver = [...kpis].sort((a, b) => b.change - a.change)[0];
  const potentialRisk = [...kpis].sort((a, b) => a.change - b.change)[0];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 glow-primary flex items-center justify-center">
          <Sparkles size={15} className="text-primary" />
        </div>
        <h3 className="text-base font-semibold text-text-primary">AI Insight</h3>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-full mt-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle size={14} />
          Couldn't load AI insight. Is the backend running?
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1.5">
              Summary
            </p>
            <p className="text-sm text-text-primary leading-relaxed">{data}</p>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-success/[0.06] border border-success/15">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-success" />
              <span className="text-sm text-text-primary">{primaryDriver.label}</span>
            </div>
            <span className="text-xs font-medium text-success">
              Primary Driver · +{primaryDriver.change}%
            </span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-danger/[0.06] border border-danger/15">
            <div className="flex items-center gap-2">
              <TrendingDown size={14} className="text-danger" />
              <span className="text-sm text-text-primary">{potentialRisk.label}</span>
            </div>
            <span className="text-xs font-medium text-danger">
              Potential Risk · {potentialRisk.change}%
            </span>
          </div>

          <button
            onClick={() => navigate("/insights")}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors pt-1"
          >
            View Full Analysis
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}