import { useState, FormEvent, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { RevenuePoint } from "../../services/dataService";

interface RevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { month: string; revenue: number }) => Promise<void>;
  editingPoint: RevenuePoint | null;
}

export default function RevenueModal({ isOpen, onClose, onSubmit, editingPoint }: RevenueModalProps) {
  const [month, setMonth] = useState("");
  const [revenue, setRevenue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingPoint) {
      setMonth(editingPoint.month);
      setRevenue(String(editingPoint.revenue));
    } else {
      setMonth("");
      setRevenue("");
    }
    setError("");
  }, [editingPoint, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const revenueNum = Number(revenue);
    if (!month.trim()) {
      setError("Month is required");
      return;
    }
    if (isNaN(revenueNum) || revenueNum < 0) {
      setError("Revenue must be a positive number");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ month, revenue: revenueNum });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingPoint ? "Edit Revenue Record" : "Add Revenue Record"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Month</label>
          <Input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="e.g. Aug" required />
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Revenue ($)</label>
          <Input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="e.g. 9200"
            required
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1 justify-center">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1 justify-center">
            {editingPoint ? "Save Changes" : "Add Record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}