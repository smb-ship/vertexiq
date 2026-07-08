import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { exportToCSV, exportToPDF } from "../../services/exportService";

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
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-white border border-black/5 shadow-sm hover:bg-background transition-colors"
      >
        <Download size={14} />
        Export
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg border border-black/5 shadow-md overflow-hidden z-20">
          <button
            onClick={() => {
              exportToCSV(data, filename);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background transition-colors"
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