import { useState, FormEvent, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { TeamMemberData } from "../../services/dataService";

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; role: string; status: string }) => Promise<void>;
  editingMember: TeamMemberData | null;
}

export default function TeamMemberModal({ isOpen, onClose, onSubmit, editingMember }: TeamMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Analyst");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name);
      setEmail(editingMember.email);
      setRole(editingMember.role);
      setStatus(editingMember.status);
    } else {
      setName("");
      setEmail("");
      setRole("Analyst");
      setStatus("Active");
    }
    setError("");
  }, [editingMember, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit({ name, email, role, status });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingMember ? "Edit Team Member" : "Add Team Member"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1.5 block">Role</label>
            <Select value={role} onChange={(e) => setRole(e.target.value)} className="w-full">
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Analyst">Analyst</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-text-muted mb-1.5 block">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full">
              <option value="Active">Active</option>
              <option value="Away">Away</option>
              <option value="Offline">Offline</option>
            </Select>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1 justify-center">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1 justify-center">
            {editingMember ? "Save Changes" : "Add Member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}