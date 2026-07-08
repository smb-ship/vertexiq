import { Search, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth, Role } from "../../lib/AuthContext";
import NotificationsDropdown from "../ui/NotificationsDropdown";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-black/5 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-black/5">
          <Menu size={20} className="text-text-muted" />
        </button>

        <div className="relative w-40 sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white text-sm border border-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* TEMPORARY: role switcher for testing role-based access — remove once real auth exists */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="hidden sm:block text-xs border border-black/10 rounded-lg px-2 py-1.5 bg-white text-text-muted"
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Analyst">Analyst</option>
        </select>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        >
          {theme === "light" ? (
            <Moon size={18} className="text-text-muted" />
          ) : (
            <Sun size={18} className="text-text-muted" />
          )}
        </button>

        <NotificationsDropdown />

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-xs font-semibold shrink-0">
          M
        </div>
      </div>
    </header>
  );
}