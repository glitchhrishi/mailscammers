import { AlertTriangle, Link2, Sparkles, ShieldCheck } from "lucide-react";

import { StatusBadge } from "./StatusBadge";
import type { AnalysisResult } from "@/lib/analyzer.functions";

function ScoreRing({ score, status }: { score: number; status: AnalysisResult["status"] }) {
  const color =
    status === "Safe" ? "text-safe" : status === "Suspicious" ? "text-warn-foreground" : "text-danger";
  const ring =
    status === "Safe" ? "stroke-safe" : status === "Suspicious" ? "stroke-warn" : "stroke-danger";
  const pct = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 36;
  const dash = (pct / 100) * circumference;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r="36" className="stroke-border" strokeWidth="6" fill="none" />
        <circle
          cx="40"
          cy="40"
          r="36"
          className={ring}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xl font-bold ${color}`}>{score}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Safety</span>
      </div>
    </div>
  );
}

export function AnalysisReport({ result }: { result: AnalysisResult }) {
  const urlColor = (risk: "low" | "medium" | "high") =>
    risk === "high"
      ? "border-danger/30 bg-danger/5 text-danger"
      : risk === "medium"
        ? "border-warn/40 bg-warn/10 text-warn-foreground"
        : "border-safe/30 bg-safe/5 text-safe";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
        <ScoreRing score={result.safetyScore} status={result.status} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold">Verdict</h3>
            <StatusBadge status={result.status} size="md" />
          </div>
          {result.aiVerdict && (
            <p className="text-sm text-muted-foreground">
              <Sparkles className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
              AI ({Math.round(result.aiVerdict.confidence * 100)}% confidence): {result.aiVerdict.explanation}
            </p>
          )}
        </div>
      </div>

      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
          <AlertTriangle className="h-4 w-4 text-warn-foreground" />
          Red flags ({result.reasons.length})
        </h4>
        <ul className="space-y-1.5">
          {result.reasons.map((r, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm rounded-md border bg-muted/40 px-3 py-2"
            >
              <span className="text-muted-foreground">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
          <Link2 className="h-4 w-4 text-primary" />
          Link analysis ({result.urls.length})
        </h4>
        {result.urls.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-md border bg-muted/40 px-3 py-2">
            <ShieldCheck className="inline h-4 w-4 mr-1 -mt-0.5 text-safe" />
            No links in this email.
          </p>
        ) : (
          <ul className="space-y-2">
            {result.urls.map((u, i) => (
              <li key={i} className={`rounded-md border px-3 py-2 ${urlColor(u.risk)}`}>
                <p className="text-xs font-mono break-all">{u.url}</p>
                <p className="text-[11px] uppercase tracking-wider mt-1 opacity-70">
                  {u.risk} risk
                </p>
                <ul className="mt-1.5 space-y-0.5">
                  {u.reasons.map((r, j) => (
                    <li key={j} className="text-xs">– {r}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
