import { Sparkles, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import { fetchAiSummary } from "../../services/aiService";

interface AiSummaryPanelProps {
  kpis: { label: string; value: string; change: number }[];
}

export default function AiSummaryPanel({ kpis }: AiSummaryPanelProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ai-summary", kpis],
    queryFn: () => fetchAiSummary(kpis),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card className="bg-gradient-to-br from-accent-purple/5 via-accent-pink/5 to-accent-magenta/5 border-accent-purple/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink">
          <Sparkles size={14} className="text-white" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">AI Summary</h3>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-rose-600">
          <AlertCircle size={14} />
          Couldn't load AI summary. Is the backend running?
        </div>
      )}

      {data && <p className="text-sm text-text-muted leading-relaxed">{data}</p>}
    </Card>
  );
}