import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, TrendingUp, Plus, Pencil, Trash2 } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import Button from "../ui/Button";
import RevenueModal from "./RevenueModal";
import { useAuth } from "../../lib/AuthContext";
import {
  fetchRevenueData,
  createRevenuePoint,
  updateRevenuePoint,
  deleteRevenuePoint,
  RevenuePoint,
} from "../../services/dataService";

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
      <p className="text-sm font-semibold text-text-primary">${payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function RevenueChart() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<RevenuePoint | null>(null);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [compareMode, setCompareMode] = useState(false);
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "Admin";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["revenue-data"],
    queryFn: () => fetchRevenueData(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (input: { month: string; revenue: number }) => createRevenuePoint(input, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["revenue-data"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (input: { month: string; revenue: number }) =>
      updateRevenuePoint(editingPoint!.id, input, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["revenue-data"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRevenuePoint(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["revenue-data"] }),
  });

  const handleDelete = (id: number) => {
    if (confirm("Delete this revenue record?")) deleteMutation.mutate(id);
  };

  const handleSubmit = async (formData: { month: string; revenue: number }) => {
    if (editingPoint) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const midpoint = data ? Math.ceil(data.length / 2) : 0;
  const firstHalf = data?.slice(0, midpoint) ?? [];
  const secondHalf = data?.slice(midpoint) ?? [];
  const firstHalfAvg = firstHalf.length ? firstHalf.reduce((s, p) => s + p.revenue, 0) / firstHalf.length : 0;
  const secondHalfAvg = secondHalf.length ? secondHalf.reduce((s, p) => s + p.revenue, 0) / secondHalf.length : 0;
  const comparisonChange = firstHalfAvg ? (((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1) : "0";

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Revenue Overview</h3>
          <p className="text-sm text-text-muted mt-0.5">Last {data?.length ?? 7} months</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-lg border border-border-subtle overflow-hidden">
            <button
              onClick={() => setChartType("line")}
              className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                chartType === "line" ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text-primary"
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                chartType === "bar" ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text-primary"
              }`}
            >
              Bar
            </button>
          </div>

          <button
            onClick={() => setCompareMode((c) => !c)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              compareMode
                ? "bg-primary/15 text-primary border-primary/30"
                : "text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            Compare
          </button>

          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">
            <TrendingUp size={12} />
            Trending up
          </div>

          {isAdmin && (
            <Button
              variant="secondary"
              onClick={() => {
                setEditingPoint(null);
                setModalOpen(true);
              }}
            >
              <Plus size={14} />
              Add
            </Button>
          )}
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
        <>
          {compareMode && (
            <div className="flex items-center gap-4 mb-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-border-subtle text-sm">
              <div>
                <p className="text-text-muted text-xs">First half avg</p>
                <p className="text-text-primary font-medium">${firstHalfAvg.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs">Second half avg</p>
                <p className="text-text-primary font-medium">${secondHalfAvg.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs">Change</p>
                <p className={`font-medium ${Number(comparisonChange) >= 0 ? "text-success" : "text-danger"}`}>
                  {Number(comparisonChange) >= 0 ? "+" : ""}
                  {comparisonChange}%
                </p>
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={280}>
            {chartType === "line" ? (
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
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
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
            ) : (
              <BarChart data={data}>
                <defs>
                  <linearGradient id="revenueBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueBar)"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </BarChart>
            )}
          </ResponsiveContainer>

          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-border-subtle space-y-1">
              {data.map((point) => (
                <div
                  key={point.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.02] text-sm"
                >
                  <span className="text-text-primary">{point.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted">${point.revenue.toLocaleString()}</span>
                    <button
                      onClick={() => {
                        setEditingPoint(point);
                        setModalOpen(true);
                      }}
                      className="p-1 text-text-muted hover:text-primary transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(point.id)}
                      className="p-1 text-text-muted hover:text-danger transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <RevenueModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingPoint={editingPoint}
      />
    </div>
  );
}