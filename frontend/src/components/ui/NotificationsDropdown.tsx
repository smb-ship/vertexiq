import { useState } from "react";
import { Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/AuthContext";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../../services/dataService";

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const { token } = useAuth();
  const queryClient = useQueryClient();

  
  const { data: notifications } = useQuery({
  queryKey: ["notifications"],
  queryFn: () => fetchNotifications(token),
  enabled: !!token,
  staleTime: 60 * 1000,
  refetchInterval: 30 * 1000,
});

  const markReadMutation = useMutation({
  mutationFn: (id: number) => markNotificationRead(id, token!),
  onMutate: async (id: number) => {
    await queryClient.cancelQueries({ queryKey: ["notifications"] });
    const previous = queryClient.getQueryData(["notifications"]);
    queryClient.setQueryData(["notifications"], (old: any) =>
      old?.map((n: any) => (n.id === id ? { ...n, unread: false } : n))
    );
    return { previous };
  },
  onError: (_err, _id, context) => {
    if (context?.previous) queryClient.setQueryData(["notifications"], context.previous);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
});

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = (notifications ?? []).filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary glow-primary" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl overflow-hidden z-20">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <span className="text-sm font-semibold text-text-primary">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-text-muted">You're all caught up 🎉</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => n.unread && markReadMutation.mutate(n.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border-subtle last:border-0 transition-colors ${
                    n.unread ? "bg-primary/[0.06] hover:bg-primary/[0.09]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <p className="text-sm text-text-primary leading-relaxed">{n.message}</p>
                  <p className="text-xs text-text-muted mt-1">{new Date(n.time).toLocaleString()}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}