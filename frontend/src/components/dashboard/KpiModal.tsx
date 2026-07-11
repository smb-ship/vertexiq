import { useState, FormEvent, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { KpiFromApi } from "../../services/dataService";
import { iconOptions } from "../../lib/iconMap";

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { label: string; value: string; change: number; icon: string }) => Promise<void>;
  editingKpi: KpiFromApi | null;
}

export default function KpiModal({ isOpen, onClose, onSubmit, editingKpi }: KpiModalProps) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [change, setChange] = useState("");
  const [icon, setIcon] = useState(iconOptions[0]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingKpi) {
      setLabel(editingKpi.label);
      setValue(editingKpi.value);
      setChange(String(editingKpi.change));
      setIcon(editingKpi.icon);
    } else {
      setLabel("");
      setValue("");
      setChange("");
      setIcon(iconOptions[0]);
    }
    setError("");
  }, [editingKpi, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const changeNum = Number(change);
    if (!label.trim() || !value.trim()) {
      setError("Label and value are required");
      return;
    }
    if (isNaN(changeNum)) {
      setError("Change must be a number");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ label, value, change: changeNum, icon });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingKpi ? "Edit KPI" : "Add KPI"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Label</label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Total Revenue" required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1.5 block">Value</label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. $48,200" required />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1.5 block">Change (%)</label>
            <Input type="number" step="0.1" value={change} onChange={(e) => setChange(e.target.value)} placeholder="e.g. 12.4" required />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Icon</label>
          <Select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full">
            {iconOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </Select>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1 justify-center">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1 justify-center">
            {editingKpi ? "Save Changes" : "Add KPI"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}