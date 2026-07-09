import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { exportToCSV, exportToPDF } from "../../services/exportService";
import Button from "./Button";
interface ExportButtonProps<T extends object> {
  title: string;
  data: T[];
  filename: string;
}

export default function ExportButton<T extends object>({
  title,
  data,
  filename,
}: ExportButtonProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="secondary" onClick={() => setOpen((o) => !o)}>
        <Download size={14} />
         Export
        <ChevronDown size={14} />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 glass-card rounded-lg overflow-hidden z-20">
          <button
            onClick={() => {
              exportToCSV(data, filename);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-white/[0.05] transition-colors"
          >
            Export as CSV
          </button>
          <button
            onClick={() => {
              exportToPDF(title, data, filename);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background transition-colors"
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}