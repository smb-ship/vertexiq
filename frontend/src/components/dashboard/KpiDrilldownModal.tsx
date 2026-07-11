import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";
import Modal from "../ui/Modal";
import { KpiFromApi } from "../../services/dataService";

export default function KpiDrilldownModal({ kpi, onClose }: { kpi: KpiFromApi | null; onClose: () => void }) {
  if (!kpi) return null;
  const chartData = kpi.trend.map((v, i) => ({ i: `P${i + 1}`, v }));

  return (
    <Modal isOpen={!!kpi} onClose={onClose} title={kpi.label}>
      <div className="space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-text-primary">{kpi.value}</span>
          <span className={`text-sm font-medium ${kpi.change >= 0 ? "text-success" : "text-danger"}`}>
            {kpi.change >= 0 ? "+" : ""}{kpi.change}% vs last period
          </span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={chartData}>
            <XAxis dataKey="i" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Line type="monotone" dataKey="v" stroke={kpi.change >= 0 ? "#22C55E" : "#EF4444"} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-text-muted">7-period trend history for this metric.</p>
      </div>
    </Modal>
  );
}