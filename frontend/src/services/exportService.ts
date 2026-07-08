import Papa from "papaparse";
import jsPDF from "jspdf";

export function exportToCSV<T extends object>(data: T[], filename: string) 
{

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF<T extends object>(title: string, data: T[], filename: string) 

{
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 20);

  doc.setFontSize(10);
  let y = 32;

  const headers = Object.keys(data[0] ?? {}) as (keyof T)[];
  doc.setFont("helvetica", "bold");
  doc.text(headers.join("   |   "), 14, y);
  doc.setFont("helvetica", "normal");

  data.forEach((row) => {
    y += 8;
    const rowText = headers.map((h) => String(row[h])).join("   |   ");
    doc.text(rowText, 14, y);
  });

  doc.save(`${filename}.pdf`);
}