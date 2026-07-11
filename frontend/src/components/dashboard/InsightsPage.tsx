import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import AiSummaryPanel from "./AiSummaryPanel";
import AiRecommendations from "./AiRecommendations";
import { useAuth } from "../../lib/AuthContext";
import { fetchKpis } from "../../services/dataService";
import TrendAnomalyPanel from "./TrendAnomalyPanel";

export default function InsightsPage() {
  const { token } = useAuth();

  const { data: kpis } = useQuery({
    queryKey: ["kpis"],
    queryFn: () => fetchKpis(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const kpisForAi = (kpis ?? []).map((k) => ({ label: k.label, value: k.value, change: k.change }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
    >
      <h1 className="text-2xl font-semibold text-text-primary">AI Insights</h1>
      <p className="text-text-muted mt-1">Automated analysis of your business data.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <AiSummaryPanel kpis={kpisForAi} />
        <AiRecommendations kpis={kpisForAi} />
        <div className="mt-4">
          <TrendAnomalyPanel />
        </div>
      </div>
    </motion.div>
  );
}