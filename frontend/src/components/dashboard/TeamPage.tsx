import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RoleBadge from "../ui/RoleBadge";
import Skeleton from "../ui/Skeleton";
import { useToast } from "../system/Toast";
import Input from "../ui/Input";
import Button from "../ui/Button";
import TeamMemberModal from "./TeamMemberModal";
import { useAuth } from "../../lib/AuthContext";
import {
  fetchTeamData,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  TeamMemberData,
} from "../../services/dataService";

const statusColors: Record<string, string> = {
  Active: "bg-success",
  Away: "bg-warning",
  Offline: "bg-text-muted",
};

export default function TeamPage() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberData | null>(null);
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "Admin";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["team-data"],
    queryFn: () => fetchTeamData(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
  mutationFn: (input: { name: string; email: string; role: string; status: string }) =>
    createTeamMember(input as any, token!),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["team-data"] });
    showToast("Team member added");
  },
});

  const updateMutation = useMutation({
  mutationFn: (input: { name: string; email: string; role: string; status: string }) =>
    updateTeamMember(editingMember!.id, input as any, token!),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["team-data"] });
    showToast("Team member updated");
  },
});

const deleteMutation = useMutation({
  mutationFn: (id: number) => deleteTeamMember(id, token!),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["team-data"] });
    showToast("Team member removed");
  },
});

  const handleAddClick = () => {
    setEditingMember(null);
    setModalOpen(true);
  };

  const handleEditClick = (member: TeamMemberData) => {
    setEditingMember(member);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Remove this team member? This can't be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalSubmit = async (formData: { name: string; email: string; role: string; status: string }) => {
    if (editingMember) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const filteredMembers = (data ?? []).filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Team</h1>
          <p className="text-text-muted mt-1">{data?.length ?? 0} members</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members..."
              className="pl-9"
            />
          </div>

          {isAdmin && (
            <Button variant="primary" onClick={handleAddClick}>
              <Plus size={15} />
              Add
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="glass-card rounded-2xl mt-6 p-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="glass-card rounded-2xl mt-6 flex items-center gap-2 text-sm text-danger py-12 justify-center">
          <AlertCircle size={14} />
          Couldn't load team data.
        </div>
      )}

      {data && filteredMembers.length === 0 && (
        <div className="glass-card rounded-2xl mt-6 py-12 text-center text-sm text-text-muted">
          No members match "{query}"
        </div>
      )}

      {data && filteredMembers.length > 0 && (
        <>
          <div className="sm:hidden mt-6 space-y-3">
            {filteredMembers.map((member) => (
              <div key={member.id} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {member.avatarInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary truncate">{member.name}</p>
                    <p className="text-xs text-text-muted truncate">{member.email}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleEditClick(member)} className="p-1.5 text-text-muted hover:text-primary transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="p-1.5 text-text-muted hover:text-danger transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
                  <RoleBadge role={member.role} />
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusColors[member.status]}`} />
                    <span className="text-xs text-text-muted">{member.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block glass-card rounded-2xl mt-6 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-text-muted">
                  <th className="font-medium px-6 py-3.5">Name</th>
                  <th className="font-medium px-6 py-3.5">Role</th>
                  <th className="font-medium px-6 py-3.5">Status</th>
                  {isAdmin && <th className="font-medium px-6 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-border-subtle last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {member.avatarInitial}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{member.name}</p>
                          <p className="text-xs text-text-muted">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusColors[member.status]}`} />
                        <span className="text-text-muted">{member.status}</span>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEditClick(member)} className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(member.id)} className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <TeamMemberModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingMember={editingMember}
      />
    </motion.div>
  );
}