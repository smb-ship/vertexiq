import { DollarSign, Users, ShoppingCart, Activity, LucideIcon } from "lucide-react";

export interface KpiData {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
}

export const kpis: KpiData[] = [
  { label: "Total Revenue", value: "$48,200", change: 12.4, icon: DollarSign },
  { label: "Active Users", value: "3,214", change: 8.1, icon: Users },
  { label: "New Orders", value: "1,082", change: -3.2, icon: ShoppingCart },
  { label: "Engagement Rate", value: "76%", change: 5.6, icon: Activity },
];