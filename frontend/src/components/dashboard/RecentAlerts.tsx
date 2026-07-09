import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

type AlertType = "success" | "warning" | "info";

interface Alert {
  id: number;
  type: AlertType;
  message: string;
  time: string;
}

const alerts: Alert[] = [
  { id: 1, type: "success", message: "Monthly revenue target reached ahead of schedule.", time: "1h ago" },
  { id: 2, type: "warning", message: "Order volume dropped 3.2% — worth investigating.", time: "4h ago" },
  { id: 3, type: "info", message: "New AI summary generated for this week.", time: "1d ago" },
];

const alertConfig: Record<AlertType, { icon: typeof CheckCircle2; color: string }> = {
  success: { icon: CheckCircle2, color: "success" },
  warning: { icon: AlertTriangle, color: "warning" },
  info: { icon: Info, color: "primary" },
};

export default function RecentAlerts() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-base font-semibold text-text-primary mb-5">Recent Alerts</h3>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div
                className={`w-7 h-7 rounded-lg bg-${config.color}/10 flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon size={14} className={`text-${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary leading-relaxed">{alert.message}</p>
                <p className="text-xs text-text-muted mt-1">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}