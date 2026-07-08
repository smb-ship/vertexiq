import { Role } from "../lib/AuthContext";

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Away" | "Offline";
  avatarInitial: string;
}