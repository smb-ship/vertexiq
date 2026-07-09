import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-white glow-primary hover:bg-primary/90 focus-visible:ring-primary/50",
  secondary: "bg-white/[0.05] text-text-primary border border-border-subtle hover:bg-white/[0.08] focus-visible:ring-primary/40",
  ghost: "text-text-muted hover:text-text-primary hover:bg-white/[0.05] focus-visible:ring-primary/40",
  danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15 focus-visible:ring-danger/40",
};

export default function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}