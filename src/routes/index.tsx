import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Inbox, ShieldCheck, Trash2, CheckCircle2, AlertTriangle, ShieldAlert, Mail } from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { EmailListItem } from "@/components/EmailListItem";
import { EmailDetailModal } from "@/components/EmailDetailModal";
import { ScanForm } from "@/components/ScanForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clearHistory, useHistory } from "@/lib/history-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LegitMail — Email scam scanner for students" },
      {
        name: "description",
        content:
          "Detect phishing and internship scams. AI-powered analysis flags red flags, risky links, and fake recruiters.",
      },
      { property: "og:title", content: "LegitMail — Email scam scanner for students" },
      {
        property: "og:description",
        content: "AI-powered scanner that flags phishing and internship scams in seconds.",
      },
    ],
  }),
  component: Dashboard,
});

type View = "inbox" | "scan" | "about";

function Dashboard() {
  const [view, setView] = useState<View>("inbox");
  const [openId, setOpenId] = useState<string | null>(null);
  const history = useHistory();

  const openEmail = openId ? history.find((e) => e.id === openId) : null;

  const counts = {
    safe: history.filter((a) => a.result.status === "Safe").length,
    suspicious: history.filter((a) => a.result.status === "Suspicious").length,
    scam: history.filter((a) => a.result.status === "Scam").length,
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar view={view} onChange={setView} />

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="max-w-5xl mx-auto p-6 md:p-10">
          <header className="mb-10">
            <div className="md:hidden flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="serif-display text-xl">LegitMail</span>
            </div>
            <p className="small-caps text-[11px] text-[var(--bronze)] mb-2">Codex · Sectio I</p>
            <h1 className="serif-display text-4xl md:text-5xl text-foreground">
              {view === "inbox" && "History Inbox"}
              {view === "scan" && "Scan an Email"}
              {view === "about" && "About LegitMail"}
            </h1>
            <div className="flex items-center gap-3 mt-4 mb-4 max-w-md">
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--bronze)]/50 to-transparent" />
              <span className="text-[var(--bronze)] text-[10px]">◆</span>
              <div className="h-px flex-1 bg-gradient-to-l from-[var(--bronze)]/50 to-transparent" />
            </div>
            <p className="text-muted-foreground max-w-2xl italic serif-display text-lg leading-relaxed">
              {view === "inbox" &&
                "Every missive examined herein is preserved for your future review."}
              {view === "scan" &&
                "Submit a suspect dispatch and we shall unveil its deceptions."}
              {view === "about" &&
                "How LegitMail shields scholars from counterfeit correspondence."}
            </p>
          </header>

          {view === "inbox" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard label="Safe" value={counts.safe} tone="safe" icon={CheckCircle2} />
                <StatCard label="Suspicious" value={counts.suspicious} tone="warn" icon={AlertTriangle} />
                <StatCard label="Scam" value={counts.scam} tone="danger" icon={ShieldAlert} />
              </div>

              {history.length === 0 ? (
                <div
                  className="rounded-lg border-2 border-dashed border-[var(--bronze)]/30 p-14 text-center relative overflow-hidden"
                  style={{ background: "var(--gradient-surface)", backgroundImage: "var(--parchment-texture)" }}
                >
                  {/* Corner ornaments */}
                  <span className="absolute top-3 left-3 text-[var(--bronze)]/50 text-sm">❦</span>
                  <span className="absolute top-3 right-3 text-[var(--bronze)]/50 text-sm">❦</span>
                  <span className="absolute bottom-3 left-3 text-[var(--bronze)]/50 text-sm">❦</span>
                  <span className="absolute bottom-3 right-3 text-[var(--bronze)]/50 text-sm">❦</span>

                  <div className="relative">
                    <div
                      className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--bronze)]/40 shadow-md"
                      style={{ background: "var(--gradient-surface)" }}
                    >
                      <Mail className="h-8 w-8 text-[var(--bronze)]" strokeWidth={1.5} />
                    </div>
                    <p className="serif-display text-2xl text-foreground">No scans yet</p>
                    <div className="flex items-center justify-center gap-2 my-3 text-[var(--bronze)]/60">
                      <span className="text-[10px]">◆</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto italic">
                      Proceed to{" "}
                      <button
                        onClick={() => setView("scan")}
                        className="text-[var(--bronze)] font-medium underline underline-offset-4 decoration-[var(--bronze)]/50 hover:decoration-[var(--bronze)]"
                      >
                        Scan an email
                      </button>{" "}
                      to examine your first dispatch.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Clear all scan history?")) clearHistory();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clear history
                    </button>
                  </div>
                  <div className="space-y-3">
                    {history.map((email) => (
                      <EmailListItem
                        key={email.id}
                        email={email}
                        status={email.result.status}
                        result={email.result}
                        onClick={() => setOpenId(email.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {view === "scan" && <ScanForm />}

          {view === "about" && (
            <div className="prose prose-sm max-w-none space-y-4 text-foreground/90">
              <p>
                LegitMail combines <strong>three layers</strong> to detect internship and recruitment scams:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Heuristic rules</strong> — checks for free-email impersonation, urgency
                  language, and pay-to-work red flags.
                </li>
                <li>
                  <strong>AI tone analysis</strong> — a language model judges phishing intent and
                  manipulative language.
                </li>
                <li>
                  <strong>Link reputation</strong> — every URL is checked against VirusTotal and
                  scanned for risky form builders (Google Forms, Typeform, Jotform) that legitimate
                  companies don't use for sensitive data.
                </li>
              </ul>
              <p className="text-muted-foreground text-sm">
                This is a risk assistant, not a verdict. Always verify recruiter emails against the
                company's official careers page before sharing personal information.
              </p>
            </div>
          )}
        </div>
      </main>

      {openEmail && (
        <EmailDetailModal
          email={openEmail}
          status={openEmail.result.status}
          result={openEmail.result}
          onClose={() => setOpenId(null)}
        />
      )}

      <ThemeToggle />
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: "safe" | "warn" | "danger";
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  const toneStyles = {
    safe: {
      ring: "border-safe/20",
      iconBg: "bg-safe/10 text-safe",
      glow: "from-safe/10",
    },
    warn: {
      ring: "border-warn/30",
      iconBg: "bg-warn/15 text-warn-foreground",
      glow: "from-warn/15",
    },
    danger: {
      ring: "border-danger/20",
      iconBg: "bg-danger/10 text-danger",
      glow: "from-danger/10",
    },
  }[tone];

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border ${toneStyles.ring} bg-card p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)] transition-all`}
      style={{ backgroundImage: "var(--parchment-texture)" }}
    >
      {/* Top bronze rule */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[var(--bronze)]/40 to-transparent" />

      <div
        className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${toneStyles.glow} to-transparent opacity-50 blur-2xl pointer-events-none`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="small-caps text-[10px] text-muted-foreground">{label}</p>
          <p className="serif-display text-4xl mt-2 text-foreground">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-md border border-[var(--bronze)]/30 ${toneStyles.iconBg}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
