import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative inline-block">
      <select
        className={`appearance-none pl-3 pr-8 py-2 rounded-lg bg-white/[0.03] border border-border-subtle text-sm text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus:border-primary/40 transition-all cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
      />
    </div>
  );
}