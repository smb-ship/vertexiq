import { Role } from "../../lib/AuthContext";

const roleStyles: Record<Role, string> = {
  Admin: "bg-accent-purple/10 text-accent-purple",
  Manager: "bg-accent-pink/10 text-accent-pink",
  Analyst: "bg-blue-500/10 text-blue-600",
};

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${roleStyles[role]}`}>
      {role}
    </span>
  );
}