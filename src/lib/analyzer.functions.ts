import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

// ---------- Types ----------

export type AnalysisStatus = "Safe" | "Suspicious" | "Scam";

export interface UrlFinding {
  url: string;
  risk: "low" | "medium" | "high";
  reasons: string[];
}

export interface AnalysisResult {
  safetyScore: number; // 0-100, higher = safer
  status: AnalysisStatus;
  reasons: string[];
  urls: UrlFinding[];
  aiVerdict?: {
    label: string;
    confidence: number;
    explanation: string;
  };
}

const EmailInput = z.object({
  subject: z.string().max(500),
  sender: z.string().min(3).max(255),
  body: z.string().max(20000),
});

// ---------- Heuristics ----------

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "proton.me", "protonmail.com", "icloud.com", "live.com", "mail.com",
]);

const TRUSTED_COMPANIES: Record<string, string[]> = {
  google: ["google.com"],
  microsoft: ["microsoft.com"],
  amazon: ["amazon.com", "amazon.jobs"],
  meta: ["meta.com", "facebook.com", "fb.com"],
  facebook: ["meta.com", "facebook.com"],
  apple: ["apple.com"],
  netflix: ["netflix.com"],
  linkedin: ["linkedin.com"],
  stripe: ["stripe.com"],
  github: ["github.com"],
  nvidia: ["nvidia.com"],
  tesla: ["tesla.com"],
};

const URGENT_PHRASES = [
  "urgent", "wire transfer", "bank details", "pay for training", "gift card",
  "crypto payment", "verify immediately", "account suspended", "click below immediately",
  "send your password", "ssn", "social security", "login immediately",
  "limited time", "payment required", "expires in 24 hours", "act now",
  "signing bonus", "processing fee", "registration fee", "training fee",
];

const SCAM_KEYWORDS = [
  "dear applicant", "processing fee", "registration fee", "training fee",
  "easy money", "guaranteed internship", "send your bank", "passport copy",
  "no experience needed", "no interview required", "selfie holding your id",
  "refundable fee",
];

const FORM_BUILDERS = [
  { pattern: /forms\.gle|docs\.google\.com\/forms/i, name: "Google Forms" },
  { pattern: /typeform\.com/i, name: "Typeform" },
  { pattern: /jotform\.com/i, name: "Jotform" },
  { pattern: /surveymonkey\.com/i, name: "SurveyMonkey" },
  { pattern: /microsoft\.com\/forms|forms\.office\.com/i, name: "Microsoft Forms" },
];

const SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".click", ".loan"];
const URL_SHORTENERS = ["bit.ly", "tinyurl.com", "goo.gl", "ow.ly", "t.co", "is.gd", "buff.ly"];

function getDomain(email: string): string {
  return (email.split("@")[1] ?? "").toLowerCase().trim();
}

function extractUrls(text: string): string[] {
  const regex = /\bhttps?:\/\/[^\s<>"')]+/gi;
  const matches = text.match(regex) ?? [];
  return Array.from(new Set(matches.map((u) => u.replace(/[.,);]+$/, ""))));
}

function urlHostname(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function mentionedTrustedCompany(text: string): string | null {
  const lower = text.toLowerCase();
  for (const c of Object.keys(TRUSTED_COMPANIES)) {
    if (lower.includes(c)) return c;
  }
  return null;
}

interface HeuristicResult {
  risk: number;
  reasons: string[];
}

function runHeuristics(subject: string, sender: string, body: string): HeuristicResult {
  const reasons: string[] = [];
  let risk = 0;

  const senderDomain = getDomain(sender);
  const combined = `${subject}\n${body}`.toLowerCase();

  // Free email impersonation
  if (FREE_EMAIL_DOMAINS.has(senderDomain)) {
    const company = mentionedTrustedCompany(combined);
    if (company) {
      reasons.push(
        `Sender uses a free email provider (${senderDomain}) but references ${company.charAt(0).toUpperCase() + company.slice(1)}.`,
      );
      risk += 30;
    }
  }

  // Company impersonation via mismatched domain
  const company = mentionedTrustedCompany(combined);
  if (company) {
    const officialDomains = TRUSTED_COMPANIES[company];
    const matches = officialDomains.some(
      (d) => senderDomain === d || senderDomain.endsWith(`.${d}`),
    );
    if (!matches && !FREE_EMAIL_DOMAINS.has(senderDomain)) {
      reasons.push(
        `Sender domain "${senderDomain}" doesn't match official ${company} domains (${officialDomains.join(", ")}).`,
      );
      risk += 20;
    }
  }

  // Urgent / financial phrases
  for (const phrase of URGENT_PHRASES) {
    if (combined.includes(phrase)) {
      reasons.push(`Contains urgent or financially risky phrase: "${phrase}".`);
      risk += 8;
    }
  }

  // Scam keywords
  for (const kw of SCAM_KEYWORDS) {
    if (combined.includes(kw)) {
      reasons.push(`Contains suspicious recruitment keyword: "${kw}".`);
      risk += 7;
    }
  }

  // Sensitive info requests
  if (/(bank account|routing number|credit card|debit card|cvv|otp|one[- ]time password|passport)/i.test(combined)) {
    reasons.push("Requests highly sensitive financial or identity information.");
    risk += 25;
  }

  // Pay-to-work
  if (/(pay|fee|payment|deposit).{0,30}(training|registration|onboarding|equipment|bonus|processing)/i.test(combined)) {
    reasons.push("Asks for payment related to hiring, training, or onboarding — legitimate employers never do this.");
    risk += 25;
  }

  // Crypto payments
  if (/(bitcoin|btc|usdt|ethereum|eth|crypto)/i.test(combined) && /(pay|send|transfer|deposit)/i.test(combined)) {
    reasons.push("Asks for cryptocurrency payment.");
    risk += 20;
  }

  return { risk: Math.min(risk, 100), reasons };
}

// ---------- URL scanning ----------

interface VtResult {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
}

async function checkUrlVirusTotal(url: string, apiKey: string): Promise<VtResult | null> {
  try {
    // VT requires base64url-encoded URL as ID for direct lookup
    const id = btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const res = await fetch(`https://www.virustotal.com/api/v3/urls/${id}`, {
      headers: { "x-apikey": apiKey },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { attributes?: { last_analysis_stats?: VtResult } };
    };
    return json.data?.attributes?.last_analysis_stats ?? null;
  } catch {
    return null;
  }
}

async function scanUrls(body: string): Promise<{ findings: UrlFinding[]; risk: number; reasons: string[] }> {
  const urls = extractUrls(body);
  const findings: UrlFinding[] = [];
  const reasons: string[] = [];
  let risk = 0;

  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  const companyMentioned = mentionedTrustedCompany(body);

  for (const url of urls.slice(0, 8)) {
    const host = urlHostname(url);
    const urlReasons: string[] = [];
    let urlRisk: "low" | "medium" | "high" = "low";

    // Suspicious TLD
    if (SUSPICIOUS_TLDS.some((tld) => host.endsWith(tld))) {
      urlReasons.push(`Uses suspicious TLD (${host}).`);
      urlRisk = "high";
      risk += 15;
    }

    // URL shortener
    if (URL_SHORTENERS.some((s) => host === s || host.endsWith(`.${s}`))) {
      urlReasons.push("URL is hidden behind a shortener — destination unknown.");
      urlRisk = urlRisk === "low" ? "medium" : urlRisk;
      risk += 8;
    }

    // External form builder mismatch
    const form = FORM_BUILDERS.find((f) => f.pattern.test(url));
    if (form) {
      urlReasons.push(`Links to ${form.name} — external form, not an official company portal.`);
      urlRisk = urlRisk === "low" ? "medium" : urlRisk;
      risk += 6;
      if (companyMentioned) {
        urlReasons.push(
          `High risk: claims to be from ${companyMentioned} but uses ${form.name} for data collection.`,
        );
        urlRisk = "high";
        risk += 20;
      }
    }

    // VirusTotal lookup
    if (apiKey) {
      const vt = await checkUrlVirusTotal(url, apiKey);
      if (vt) {
        if (vt.malicious > 0) {
          urlReasons.push(`VirusTotal: ${vt.malicious} engines flagged as malicious.`);
          urlRisk = "high";
          risk += 25;
        } else if (vt.suspicious > 0) {
          urlReasons.push(`VirusTotal: ${vt.suspicious} engines flagged as suspicious.`);
          urlRisk = urlRisk === "low" ? "medium" : urlRisk;
          risk += 10;
        } else if (vt.harmless > 0) {
          urlReasons.push(`VirusTotal: clean (${vt.harmless} harmless reports).`);
        }
      }
    }

    if (urlReasons.length === 0) {
      urlReasons.push("No obvious red flags detected on this link.");
    }

    findings.push({ url, risk: urlRisk, reasons: urlReasons });
  }

  if (findings.some((f) => f.risk === "high")) {
    reasons.push("One or more links in this email are high risk.");
  }

  return { findings, risk: Math.min(risk, 100), reasons };
}

// ---------- AI verdict ----------

async function runAiAnalysis(subject: string, sender: string, body: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return null;

  try {
    const gateway = createLovableAiGatewayProvider(key);
    const truncatedBody = body.slice(0, 4000);

    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          label: z.enum(["safe", "suspicious", "scam"]),
          confidence: z.number().min(0).max(1),
          explanation: z.string(),
        }),
      }),
      system:
        "You are a security analyst that detects phishing and recruitment scams targeting students looking for internships. Be strict about: requests for money, personal financial info, free email domains impersonating major companies, urgency pressure, and use of external forms for sensitive data.",
      prompt: `Classify this email.

From: ${sender}
Subject: ${subject}

Body:
${truncatedBody}

Return label, confidence 0-1, and a 1-2 sentence explanation of why.`,
    });

    return output;
  } catch (err) {
    console.error("AI analysis failed:", err);
    return null;
  }
}

// ---------- Verdict combiner ----------

function combineVerdict(totalRisk: number): AnalysisStatus {
  if (totalRisk >= 60) return "Scam";
  if (totalRisk >= 25) return "Suspicious";
  return "Safe";
}

// ---------- Server function ----------

export const analyzeEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const heur = runHeuristics(data.subject, data.sender, data.body);
    const urlScan = await scanUrls(data.body);
    const ai = await runAiAnalysis(data.subject, data.sender, data.body);

    let total = heur.risk + urlScan.risk;
    const reasons = [...heur.reasons, ...urlScan.reasons];

    let aiVerdict: AnalysisResult["aiVerdict"];
    if (ai) {
      aiVerdict = {
        label: ai.label,
        confidence: ai.confidence,
        explanation: ai.explanation,
      };
      if (ai.label === "scam") total += Math.round(40 * ai.confidence);
      else if (ai.label === "suspicious") total += Math.round(20 * ai.confidence);
    }

    total = Math.min(total, 100);

    if (reasons.length === 0 && (!ai || ai.label === "safe")) {
      reasons.push("No major scam indicators detected.");
    }

    return {
      safetyScore: 100 - total,
      status: combineVerdict(total),
      reasons,
      urls: urlScan.findings,
      aiVerdict,
    };
  });
