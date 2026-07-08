import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Card from "../ui/Card";
import ExportButton from "../ui/ExportButton";
import Skeleton from "../ui/Skeleton";
import { fetchTrafficData } from "../../services/dataService";

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
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Traffic by Source</h3>
          <p className="text-xs text-text-muted mt-0.5">This month</p>
        </div>

        {isLoading && <Skeleton className="h-[300px] w-full" />}

        {isError && (
          <div className="flex items-center gap-2 text-sm text-rose-600 h-[300px] justify-center">
            <AlertCircle size={14} />
            Couldn't load traffic data.
          </div>
        )}

        {data && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000008" vertical={false} />
              <XAxis dataKey="source" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="visits" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}