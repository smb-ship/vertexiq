import { Role } from "../../lib/AuthContext";

const roleStyles: Record<Role, string> = {
  Admin: "bg-primary/10 text-primary",
  Manager: "bg-warning/10 text-warning",
  Analyst: "bg-success/10 text-success",
};

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${roleStyles[role]}`}>
      {role}
    </span>
  );
}