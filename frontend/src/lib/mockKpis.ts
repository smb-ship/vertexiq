import { DollarSign, Users, ShoppingCart, Activity, LucideIcon } from "lucide-react";

export interface KpiData {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  trend: number[];
}

export const kpis: KpiData[] = [
  { label: "Total Revenue", value: "$48,200", change: 12.4, icon: DollarSign, trend: [30, 42, 38, 55, 48, 62, 71] },
  { label: "Active Users", value: "3,214", change: 8.1, icon: Users, trend: [40, 38, 45, 42, 50, 55, 58] },
  { label: "New Orders", value: "1,082", change: -3.2, icon: ShoppingCart, trend: [55, 50, 52, 48, 45, 42, 40] },
  { label: "Engagement Rate", value: "76%", change: 5.6, icon: Activity, trend: [35, 40, 38, 45, 48, 52, 56] },
];