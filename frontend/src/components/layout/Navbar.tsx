import { useNavigate } from "react-router-dom";
import { Search, Menu, Plus, LogOut } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuth } from "../../lib/AuthContext";
import NotificationsDropdown from "../ui/NotificationsDropdown";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 glass-card rounded-none border-x-0 border-t-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-40 sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="primary" className="hidden sm:flex" onClick={() => window.print()}>
          <Plus size={15} />
          Quick Action
        </Button>

        <NotificationsDropdown />

        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {user?.name?.[0] ?? "?"}
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}