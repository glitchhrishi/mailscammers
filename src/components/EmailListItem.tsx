import { format } from "date-fns";

import { StatusBadge } from "./StatusBadge";
import type { AnalysisResult, AnalysisStatus } from "@/lib/analyzer.functions";

interface Props {
  email: { senderName: string; sender: string; subject: string; body: string; date: string };
  status: AnalysisStatus | "Analyzing" | null;
  result?: AnalysisResult;
  onClick: () => void;
}

export function EmailListItem({ email, status, result, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold truncate">{email.senderName}</p>
            <span className="text-xs text-muted-foreground truncate">&lt;{email.sender}&gt;</span>
          </div>
          <p className="text-sm font-medium text-foreground line-clamp-1">{email.subject}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {email.body.replace(/\s+/g, " ").trim()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {format(new Date(email.date), "MMM d")}
          </span>
          <StatusBadge status={status} />
          {result && (
            <span className="text-xs text-muted-foreground">
              Score {result.safetyScore}/100
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
