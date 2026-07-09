import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Card from "../ui/Card";
import ExportButton from "../ui/ExportButton";
import Skeleton from "../ui/Skeleton";
import { fetchTrafficData } from "../../services/dataService";

interface TooltipPayload {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipPayload) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="glass-card rounded-xl px-4 py-3 border border-border-subtle">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-sm font-semibold text-text-primary">
        {payload[0].value.toLocaleString()} visits
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["traffic-data"],
    queryFn: fetchTrafficData,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Analytics</h1>
          <p className="text-text-muted mt-1">Traffic and engagement breakdown.</p>
        </div>

        {data && <ExportButton title="Traffic by Source" data={data} filename="traffic-report" />}
      </div>

      <Card className="mt-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-text-primary">Traffic by Source</h3>
          <p className="text-sm text-text-muted mt-0.5">This month</p>
        </div>

        {isLoading && <Skeleton className="h-[300px] w-full" />}

        {isError && (
          <div className="flex items-center gap-2 text-sm text-danger h-[300px] justify-center">
            <AlertCircle size={14} />
            Couldn't load traffic data.
          </div>
        )}

        {data && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <defs>
                <linearGradient id="trafficBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="source" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
              <Bar
                dataKey="visits"
                fill="url(#trafficBar)"
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}