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
          <header className="mb-8">
            <div className="md:hidden flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-semibold">LegitMail</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {view === "inbox" && "History inbox"}
              {view === "scan" && "Scan an email"}
              {view === "about" && "About LegitMail"}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {view === "inbox" &&
                "Every email you scan is saved here so you can revisit the analysis."}
              {view === "scan" &&
                "Got a sketchy recruiter email? Paste it in and we'll break down the red flags."}
              {view === "about" &&
                "How LegitMail protects students from internship scams and phishing."}
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
                  className="rounded-3xl border border-dashed border-border/70 p-12 text-center relative overflow-hidden"
                  style={{ background: "var(--gradient-surface)" }}
                >
                  <div
                    className="absolute inset-x-0 -top-20 mx-auto h-40 w-40 rounded-full opacity-20 blur-3xl"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                  <div className="relative">
                    <div
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 shadow-sm"
                      style={{ background: "var(--gradient-surface)" }}
                    >
                      <Mail className="h-7 w-7 text-primary" strokeWidth={1.75} />
                    </div>
                    <p className="font-semibold text-lg">No scans yet</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                      Head to{" "}
                      <button
                        onClick={() => setView("scan")}
                        className="text-primary font-medium hover:underline underline-offset-2"
                      >
                        Scan an email
                      </button>{" "}
                      to analyze your first message.
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
      className={`group relative overflow-hidden rounded-2xl border ${toneStyles.ring} bg-card p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)] transition-all`}
    >
      <div
        className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${toneStyles.glow} to-transparent opacity-60 blur-2xl pointer-events-none`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
            {label}
          </p>
          <p className="text-3xl font-bold mt-2 tracking-tight text-foreground">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneStyles.iconBg}`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}
