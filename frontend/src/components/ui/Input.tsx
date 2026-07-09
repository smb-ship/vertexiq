import { InputHTMLAttributes } from "react";

export default function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3.5 py-2 rounded-lg bg-white/[0.03] border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}