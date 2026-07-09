import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, BarChart3, Sparkles, Settings, Users, X } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Manager", "Analyst"] },
  { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["Admin", "Manager", "Analyst"] },
  { to: "/insights", label: "AI Insights", icon: Sparkles, roles: ["Admin", "Manager", "Analyst"] },
  { to: "/team", label: "Team", icon: Users, roles: ["Admin", "Manager"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["Admin"] },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { role } = useAuth();
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`glass-card w-64 h-screen flex flex-col fixed left-0 top-0 z-40 rounded-none lg:rounded-r-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="px-6 py-7 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary glow-primary flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-text-primary tracking-tight">
              VertexIQ
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className="relative block"
            >
              {({ isActive }) => (
                <div
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-text-primary"
                      : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-primary/15 border border-primary/30 rounded-xl glow-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border-subtle">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.03] transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
              M
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">Mal</p>
              <p className="text-xs text-text-muted truncate">{role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}