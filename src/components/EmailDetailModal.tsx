import { Loader2, X } from "lucide-react";
import { format } from "date-fns";

import { AnalysisReport } from "./AnalysisReport";
import type { AnalysisResult, AnalysisStatus } from "@/lib/analyzer.functions";
import type { SampleEmail } from "@/lib/sample-emails";

interface Props {
  email: SampleEmail;
  status: AnalysisStatus | "Analyzing" | null;
  result?: AnalysisResult;
  onClose: () => void;
}

export function EmailDetailModal({ email, status, result, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2 max-h-[90vh] overflow-hidden">
          <div className="overflow-y-auto p-6 border-r">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Email</p>
            <h2 className="text-lg font-semibold leading-snug mb-3">{email.subject}</h2>
            <div className="text-sm text-muted-foreground space-y-1 mb-4 pb-4 border-b">
              <p>
                <span className="text-foreground font-medium">From:</span>{" "}
                {email.senderName} &lt;{email.sender}&gt;
              </p>
              <p>
                <span className="text-foreground font-medium">Date:</span>{" "}
                {format(new Date(email.date), "PPP p")}
              </p>
            </div>
            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground/90">
              {email.body}
            </pre>
          </div>

          <div className="overflow-y-auto p-6 bg-muted/20">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Scam analysis report
            </p>
            {status === "Analyzing" || !result ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground py-12 justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                AI is analyzing this email…
              </div>
            ) : (
              <AnalysisReport result={result} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
