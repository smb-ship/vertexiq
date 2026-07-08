import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import Card from "./Card";
import Skeleton from "./Skeleton";

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  isLoading?: boolean;
}

export default function KpiCard({ label, value, change, icon: Icon, isLoading }: KpiCardProps) {
  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3 w-32" />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted font-medium">{label}</span>
        <div className="p-2 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-pink/10">
          <Icon size={16} className="text-accent-purple" />
        </div>
      </div>

      <span className="text-2xl font-semibold text-text-primary">{value}</span>

      <div
        className={`flex items-center gap-1 text-xs font-medium ${
          isPositive ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {Math.abs(change)}% vs last month
      </div>
    </Card>
  );
}