import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { fetchTeamData, TeamMemberData } from "../../services/dataService";

function statusFromMemberStatus(status: TeamMemberData["status"]): {
  label: string;
  color: string;
  percent: number;
} {
  if (status === "Active") return { label: "Excellent", color: "success", percent: 88 };
  if (status === "Away") return { label: "Good", color: "warning", percent: 64 };
  return { label: "Needs Attention", color: "danger", percent: 32 };
}

export default function TeamPerformance() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["team-data"],
    queryFn: fetchTeamData,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-text-primary">Team Performance</h3>
        <p className="text-sm text-text-muted mt-0.5">This month</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle size={14} />
          Couldn't load team data.
        </div>
      )}

      {data && (
        <div className="space-y-5">
          {data.map((member) => {
            const perf = statusFromMemberStatus(member.status);
            return (
              <div key={member.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {member.avatarInitial}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{member.name}</p>
                      <p className="text-xs text-text-muted truncate">{member.role}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-medium text-${perf.color}`}>
                        {perf.percent}%
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full bg-${perf.color}/10 text-${perf.color}`}
                      >
                        {perf.label}
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${perf.percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" as const }}
                      className={`h-full rounded-full bg-${perf.color}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}