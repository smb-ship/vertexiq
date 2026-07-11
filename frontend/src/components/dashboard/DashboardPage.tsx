import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw } from "lucide-react";
import KpiCard from "../ui/KpiCard";
import Button from "../ui/Button";
import RevenueChart from "./RevenueChart";
import AiSummaryPanel from "./AiSummaryPanel";
import AiRecommendations from "./AiRecommendations";
import TeamPerformance from "./TeamPerformance";
import RecentAlerts from "./RecentAlerts";
import KpiModal from "./KpiModal";
import KpiDrilldownModal from "./KpiDrilldownModal";
import { useAuth } from "../../lib/AuthContext";
import { fetchKpis, createKpi, updateKpi, KpiFromApi } from "../../services/dataService";
import { iconMap } from "../../lib/iconMap";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KpiFromApi | null>(null);
  const [drilldownKpi, setDrilldownKpi] = useState<KpiFromApi | null>(null);
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "Admin";

  const { data: kpis, isLoading } = useQuery({
    queryKey: ["kpis"],
    queryFn: () => fetchKpis(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (input: { label: string; value: string; change: number; icon: string }) =>
      createKpi(input, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kpis"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (input: { label: string; value: string; change: number; icon: string }) =>
      updateKpi(editingKpi!.id, input, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kpis"] }),
  });

  const handleSubmit = async (formData: { label: string; value: string; change: number; icon: string }) => {
    if (editingKpi) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const kpisForAi = (kpis ?? []).map((k) => ({ label: k.label, value: k.value, change: k.change }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome back. Here's what's happening.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["kpis"] })}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          {isAdmin && (
            <Button
              variant="secondary"
              onClick={() => {
                setEditingKpi(null);
                setModalOpen(true);
              }}
            >
              <Plus size={14} />
              Add KPI
            </Button>
          )}
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
      >
        {isLoading || !kpis
          ? [1, 2, 3, 4].map((i) => (
              <motion.div key={i} variants={itemVariants}>
                <KpiCard
                  label=""
                  value=""
                  change={0}
                  icon={iconMap.Activity}
                  trend={[0, 0, 0, 0, 0, 0, 0]}
                  isLoading
                />
              </motion.div>
            ))
          : kpis.map((kpi) => (
              <motion.div key={kpi.id} variants={itemVariants} className="relative group">
                <KpiCard
                  label={kpi.label}
                  value={kpi.value}
                  change={kpi.change}
                  icon={iconMap[kpi.icon] ?? iconMap.Activity}
                  trend={kpi.trend}
                  onClick={() => setDrilldownKpi(kpi)}
                />
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingKpi(kpi);
                      setModalOpen(true);
                    }}
                    className="absolute top-3 right-3 text-xs text-text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity bg-surface/80 px-2 py-1 rounded-md"
                  >
                    Edit
                  </button>
                )}
              </motion.div>
            ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
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
          <AiSummaryPanel kpis={kpisForAi} />
          <RecentAlerts />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.4 }} className="mt-6">
        <AiRecommendations kpis={kpisForAi} />
      </motion.div>

      <KpiModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingKpi={editingKpi}
      />

      <KpiDrilldownModal kpi={drilldownKpi} onClose={() => setDrilldownKpi(null)} />
    </div>
  );
}