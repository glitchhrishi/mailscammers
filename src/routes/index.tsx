import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { EmailListItem } from "@/components/EmailListItem";
import { EmailDetailModal } from "@/components/EmailDetailModal";
import { ScanForm } from "@/components/ScanForm";
import { analyzeEmail, type AnalysisResult, type AnalysisStatus } from "@/lib/analyzer.functions";
import { SAMPLE_EMAILS } from "@/lib/sample-emails";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeIntern — Email scam scanner for students" },
      {
        name: "description",
        content:
          "Detect phishing and internship scams in your inbox. AI-powered analysis flags red flags, risky links, and fake recruiters.",
      },
      { property: "og:title", content: "SafeIntern — Email scam scanner for students" },
      {
        property: "og:description",
        content: "AI-powered scanner that flags phishing and internship scams in seconds.",
      },
    ],
  }),
  component: Dashboard,
});

type View = "inbox" | "scan" | "about";
type AnalysisState = {
  status: AnalysisStatus | "Analyzing" | null;
  result?: AnalysisResult;
};

function Dashboard() {
  const [view, setView] = useState<View>("inbox");
  const [openId, setOpenId] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, AnalysisState>>({});
  const [analyzing, setAnalyzing] = useState(true);
  const analyze = useServerFn(analyzeEmail);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setAnalyzing(true);
      // Mark all as analyzing
      setAnalyses(
        Object.fromEntries(SAMPLE_EMAILS.map((e) => [e.id, { status: "Analyzing" as const }])),
      );
      for (const email of SAMPLE_EMAILS) {
        if (cancelled) return;
        try {
          const result = await analyze({
            data: { sender: email.sender, subject: email.subject, body: email.body },
          });
          if (cancelled) return;
          setAnalyses((prev) => ({
            ...prev,
            [email.id]: { status: result.status, result },
          }));
        } catch {
          if (cancelled) return;
          setAnalyses((prev) => ({ ...prev, [email.id]: { status: null } }));
        }
      }
      if (!cancelled) setAnalyzing(false);
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [analyze]);

  const openEmail = openId ? SAMPLE_EMAILS.find((e) => e.id === openId) : null;
  const openState = openId ? analyses[openId] : undefined;

  const counts = {
    safe: Object.values(analyses).filter((a) => a.status === "Safe").length,
    suspicious: Object.values(analyses).filter((a) => a.status === "Suspicious").length,
    scam: Object.values(analyses).filter((a) => a.status === "Scam").length,
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
              <span className="font-semibold">SafeIntern</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {view === "inbox" && "Your demo inbox"}
              {view === "scan" && "Scan an email"}
              {view === "about" && "About SafeIntern"}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {view === "inbox" &&
                "Sample emails students often receive while job-hunting. Each one is scored for scam risk."}
              {view === "scan" &&
                "Got a sketchy recruiter email? Paste it in and we'll break down the red flags."}
              {view === "about" &&
                "How SafeIntern protects students from internship scams and phishing."}
            </p>
          </header>

          {view === "inbox" && (
            <>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard label="Safe" value={counts.safe} tone="safe" />
                <StatCard label="Suspicious" value={counts.suspicious} tone="warn" />
                <StatCard label="Scam" value={counts.scam} tone="danger" />
              </div>

              {analyzing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Analyzing emails with AI…
                </div>
              )}

              <div className="space-y-3">
                {SAMPLE_EMAILS.map((email) => {
                  const a = analyses[email.id] ?? { status: null };
                  return (
                    <EmailListItem
                      key={email.id}
                      email={email}
                      status={a.status}
                      result={a.result}
                      onClick={() => setOpenId(email.id)}
                    />
                  );
                })}
              </div>
            </>
          )}

          {view === "scan" && <ScanForm />}

          {view === "about" && (
            <div className="prose prose-sm max-w-none space-y-4 text-foreground/90">
              <p>
                SafeIntern combines <strong>three layers</strong> to detect internship and recruitment scams:
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

      {openEmail && openState && (
        <EmailDetailModal
          email={openEmail}
          status={openState.status}
          result={openState.result}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "safe" | "warn" | "danger" }) {
  const styles =
    tone === "safe"
      ? "border-safe/30 bg-safe/5"
      : tone === "warn"
        ? "border-warn/40 bg-warn/10"
        : "border-danger/30 bg-danger/5";
  const text =
    tone === "safe" ? "text-safe" : tone === "warn" ? "text-warn-foreground" : "text-danger";
  return (
    <div className={`rounded-xl border p-4 ${styles}`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${text}`}>{value}</p>
    </div>
  );
}
