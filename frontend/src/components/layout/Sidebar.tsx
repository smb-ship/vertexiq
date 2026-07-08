import { NavLink } from "react-router-dom";
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
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`w-64 h-screen bg-sidebar text-text-inverse flex flex-col fixed left-0 top-0 z-40 transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="px-6 py-6 flex items-center justify-between">
          <span className="text-xl font-semibold bg-gradient-to-r from-accent-purple via-accent-pink to-accent-magenta bg-clip-text text-transparent">
            VertexIQ
          </span>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 text-white"
                    : "text-white/60 hover:bg-sidebar-hover hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 text-xs text-white/30">v1.0.0 · Beta</div>
      </aside>
    </>
  );
}