import { Lightbulb, ArrowRight, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import { fetchAiRecommendations } from "../../services/aiService";

interface AiRecommendationsProps {
  kpis: { label: string; value: string; change: number }[];
}

export default function AiRecommendations({ kpis }: AiRecommendationsProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ai-recommendations", kpis],
    queryFn: () => fetchAiRecommendations(kpis),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-accent-pink" />
        <h3 className="text-sm font-semibold text-text-primary">AI Recommendations</h3>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-rose-600">
          <AlertCircle size={14} />
          Couldn't load recommendations. Is the backend running?
        </div>
      )}

      {data && (
        <div className="space-y-3">
          {data.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 rounded-xl bg-background/60 hover:bg-background transition-colors duration-150"
            >
              <ArrowRight size={14} className="text-accent-purple mt-0.5 shrink-0" />
              <p className="text-sm text-text-muted leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}