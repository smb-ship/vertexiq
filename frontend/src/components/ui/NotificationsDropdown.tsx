import { useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  time: string;
  unread: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, message: "Revenue report for June is ready to view.", time: "2h ago", unread: true },
  { id: 2, message: "New user signup spike detected — 42 today.", time: "5h ago", unread: true },
  { id: 3, message: "Weekly AI summary has been generated.", time: "1d ago", unread: false },
];

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

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
                onClick={markAllRead}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-text-muted">You're all caught up 🎉</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-border-subtle last:border-0 transition-colors ${
                    n.unread ? "bg-primary/[0.06]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <p className="text-sm text-text-primary leading-relaxed">{n.message}</p>
                  <p className="text-xs text-text-muted mt-1">{n.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}