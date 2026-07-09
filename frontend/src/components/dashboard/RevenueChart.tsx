import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, TrendingUp } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { fetchRevenueData } from "../../services/dataService";

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
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["revenue-data"],
    queryFn: fetchRevenueData,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Revenue Overview</h3>
          <p className="text-sm text-text-muted mt-0.5">Last 7 months</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">
          <TrendingUp size={12} />
          Trending up
        </div>
      </div>

      {isLoading && <Skeleton className="h-[280px] w-full" />}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-danger h-[280px] justify-center">
          <AlertCircle size={14} />
          Couldn't load revenue data.
        </div>
      )}

      {data && (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity={1} />
              </linearGradient>
              <filter id="revenueGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(59,130,246,0.2)", strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="url(#revenueLine)"
              strokeWidth={2.5}
              filter="url(#revenueGlow)"
              dot={{ fill: "#3B82F6", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#60A5FA" }}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}