import { motion } from "framer-motion";
import AiSummaryPanel from "./AiSummaryPanel";
import AiRecommendations from "./AiRecommendations";
import { kpis } from "../../lib/mockKpis";

export default function InsightsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
    >
      <h1 className="text-2xl font-semibold text-text-primary">AI Insights</h1>
      <p className="text-text-muted mt-1">Automated analysis of your business data.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <AiSummaryPanel kpis={kpis} />
        <AiRecommendations kpis={kpis} />
      </div>
    </motion.div>
  );
}