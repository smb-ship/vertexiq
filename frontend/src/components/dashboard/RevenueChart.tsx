import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import { fetchRevenueData } from "../../services/dataService";

export default function RevenueChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["revenue-data"],
    queryFn: fetchRevenueData,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Revenue Overview</h3>
        <p className="text-xs text-text-muted mt-0.5">Last 7 months</p>
      </div>

      {isLoading && <Skeleton className="h-[280px] w-full" />}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-rose-600 h-[280px] justify-center">
          <AlertCircle size={14} />
          Couldn't load revenue data.
        </div>
      )}

      {data && (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000008" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="url(#revenueGradient)"
              strokeWidth={2.5}
              dot={{ fill: "#8B5CF6", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}