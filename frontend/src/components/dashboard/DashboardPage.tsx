import { motion } from "framer-motion";
import KpiCard from "../ui/KpiCard";
import RevenueChart from "./RevenueChart";
import TeamPerformance from "./TeamPerformance";
import AiSummaryPanel from "./AiSummaryPanel";
import AiRecommendations from "./AiRecommendations";
import { useMockLoading } from "../../hooks/useMockLoading";
import { kpis } from "../../lib/mockKpis";
import RecentAlerts from "./RecentAlerts";


const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function DashboardPage() {
  const isLoading = useMockLoading();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
      <p className="text-text-muted mt-1">Welcome back. Here's what's happening.</p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
      >
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={itemVariants}>
            <KpiCard {...kpi} isLoading={isLoading} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
  variants={itemVariants}
  initial="hidden"
  animate="show"
  transition={{ delay: 0.3 }}
  className="lg:col-span-2 space-y-6"
>
  <RevenueChart />
  <TeamPerformance />
</motion.div>

        <motion.div
  variants={itemVariants}
  initial="hidden"
  animate="show"
  transition={{ delay: 0.35 }}
  className="space-y-6"
>
  <AiSummaryPanel kpis={kpis} />
  <RecentAlerts />
</motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <AiRecommendations kpis={kpis} />
      </motion.div>
    </div>
  );
}