import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import Skeleton from "./Skeleton";

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  trend: number[];
  isLoading?: boolean;
}

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  trend: number[];
  isLoading?: boolean;
  onClick?: () => void;
}

export default function KpiCard({ label, value, change, icon: Icon, trend, isLoading, onClick }: KpiCardProps) {
  const isPositive = change >= 0;
  const trendData = trend.map((v, i) => ({ i, v }));

  if (isLoading) {
    return (
      <div
  onClick={onClick}
  className={`glass-card rounded-2xl p-5 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] ${onClick ? "cursor-pointer" : ""}`}
>
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)]">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 glow-primary flex items-center justify-center">
          <Icon size={17} className="text-primary" />
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
          }`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      </div>

      <div>
        <p className="text-2xl font-semibold text-text-primary tracking-tight">{value}</p>
        <p className="text-sm text-text-muted mt-0.5">{label}</p>
      </div>

      <div className="h-8 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={isPositive ? "#22C55E" : "#EF4444"}
              strokeWidth={1.75}
              dot={false}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}