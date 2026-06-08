import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send } from "lucide-react";

import { analyzeEmail, type AnalysisResult } from "@/lib/analyzer.functions";
import { addToHistory } from "@/lib/history-store";
import { AnalysisReport } from "./AnalysisReport";

export function ScanForm() {
  const analyze = useServerFn(analyzeEmail);
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await analyze({ data: { sender, subject, body } });
      setResult(res);
      const senderName = sender.includes("@") ? sender.split("@")[0] : sender;
      addToHistory({ sender, senderName, subject, body, result: res });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Paste a suspicious email</h2>
          <p className="text-sm text-muted-foreground">
            Forwarded an "internship offer" that feels off? Paste it here and we'll check it.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sender email</label>
          <input
            type="email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="recruiter@example.com"
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Internship opportunity at..."
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the full email text…"
            required
            rows={10}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {loading ? "Analyzing…" : "Analyze email"}
        </button>

        {error && (
          <p className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}
      </form>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Analysis report</h2>
        {loading && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground py-12 justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Running heuristics, AI, and link checks…
          </div>
        )}
        {!loading && !result && (
          <p className="text-sm text-muted-foreground py-12 text-center">
            Your report will appear here.
          </p>
        )}
        {!loading && result && <AnalysisReport result={result} />}
      </div>
    </div>
  );
}
