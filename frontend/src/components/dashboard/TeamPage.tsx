import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Card from "../ui/Card";
import RoleBadge from "../ui/RoleBadge";
import Skeleton from "../ui/Skeleton";
import { fetchTeamData } from "../../services/dataService";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500",
  Away: "bg-amber-500",
  Offline: "bg-gray-300",
};

export default function TeamPage() {
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["team-data"],
    queryFn: fetchTeamData,
    staleTime: 5 * 60 * 1000,
  });

  const filteredMembers = (data ?? []).filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Team</h1>
          <p className="text-text-muted mt-1">{data?.length ?? 0} members</p>
        </div>

        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white text-sm border border-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30"
          />
        </div>
      </div>

      <Card className="mt-6 !p-0 overflow-hidden">
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 text-sm text-rose-600 py-12 justify-center">
            <AlertCircle size={14} />
            Couldn't load team data.
          </div>
        )}

        {data && filteredMembers.length === 0 && (
          <div className="py-12 text-center text-sm text-text-muted">
            No members match "{query}"
          </div>
        )}

        {data && filteredMembers.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-text-muted">
                <th className="font-medium px-6 py-3">Name</th>
                <th className="font-medium px-6 py-3">Role</th>
                <th className="font-medium px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-black/5 last:border-0 hover:bg-background/60 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {member.avatarInitial}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{member.name}</p>
                        <p className="text-xs text-text-muted">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusColors[member.status]}`} />
                      <span className="text-text-muted">{member.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </motion.div>
  );
}