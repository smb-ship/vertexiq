import { motion } from "framer-motion";
import { User } from "lucide-react";
import Card from "../ui/Card";
import { useAuth } from "../../lib/AuthContext";

export default function SettingsPage() {
  const { role } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
    >
      <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
      <p className="text-text-muted mt-1">Manage your profile.</p>

      <div className="grid grid-cols-1 gap-4 mt-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-text-primary">Profile</h3>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-lg font-semibold">
              M
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Mal</p>
              <p className="text-xs text-text-muted">mal@vertexiq.com</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border-subtle">
            <span className="text-sm text-text-muted">Role</span>
            <span className="text-sm font-medium text-primary px-2 py-0.5 rounded-md bg-primary/10">
              {role}
            </span>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}