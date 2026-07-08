import { motion } from "framer-motion";
import { User, Palette } from "lucide-react";
import Card from "../ui/Card";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../lib/AuthContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { role } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
    >
      <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
      <p className="text-text-muted mt-1">Manage your profile and preferences.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-accent-purple" />
            <h3 className="text-sm font-semibold text-text-primary">Profile</h3>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-lg font-semibold">
              M
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Mal</p>
              <p className="text-xs text-text-muted">mal@vertexiq.com</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-black/5">
            <span className="text-sm text-text-muted">Role</span>
            <span className="text-sm font-medium text-text-primary px-2 py-0.5 rounded-md bg-accent-purple/10 text-accent-purple">
              {role}
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Palette size={16} className="text-accent-pink" />
            <h3 className="text-sm font-semibold text-text-primary">Preferences</h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text-primary">Theme</p>
              <p className="text-xs text-text-muted mt-0.5">Switch between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-11 h-6 rounded-full bg-gradient-to-r from-accent-purple to-accent-pink transition-colors"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}