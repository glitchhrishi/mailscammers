import { ShieldCheck, ShieldAlert, ShieldX, Loader2 } from "lucide-react";

import type { AnalysisStatus } from "@/lib/analyzer.functions";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: AnalysisStatus | "Analyzing" | null;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  if (!status) return null;

  const isSmall = size === "sm";
  const base = cn(
    "inline-flex items-center gap-1.5 rounded-full font-medium border",
    isSmall ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
  );

  if (status === "Analyzing") {
    return (
      <span className={cn(base, "bg-muted text-muted-foreground border-border")}>
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Analyzing
      </span>
    );
  }

  if (status === "Safe") {
    return (
      <span className={cn(base, "bg-safe/10 text-safe border-safe/30")}>
        <ShieldCheck className="h-3.5 w-3.5" />
        Safe
      </span>
    );
  }

  if (status === "Suspicious") {
    return (
      <span className={cn(base, "bg-warn/15 text-warn-foreground border-warn/40")}>
        <ShieldAlert className="h-3.5 w-3.5" />
        Suspicious
      </span>
    );
  }

  return (
    <span className={cn(base, "bg-danger/10 text-danger border-danger/30")}>
      <ShieldX className="h-3.5 w-3.5" />
      Scam
    </span>
  );
}
