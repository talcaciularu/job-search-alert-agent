"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Building,
  ChevronRight,
  CircleCheckBig,
  CircleX,
  Clock,
  Database,
  MapPin,
  RefreshCw,
  Send,
  Sparkles,
  Wallet,
} from "lucide-react";

const REPO_URL = "https://github.com/talcaciularu/job-search-alert-agent";

type Tier = "high" | "mid" | "low";

type Role = {
  id: string;
  title: string;
  company: string;
  location: string;
  workModel: string;
  salary: string;
  dateParsed: string;
  score: number;
  highlights: string[];
  mustHave: string[];
  niceToHave: string[];
  telegramPreview: string;
};

const TIER_STYLES: Record<Tier, { bg: string; text: string; border: string; dot: string }> = {
  high: { bg: "#EEF3EC", text: "#3F6152", border: "#D7E4D2", dot: "#6B8F73" },
  mid: { bg: "#F1EFF9", text: "#5C4F94", border: "#DDD6F3", dot: "#7C6FC2" },
  low: { bg: "#FBEEE7", text: "#9C5636", border: "#F0D7C7", dot: "#C1774E" },
};

function tierFromScore(score: number): Tier {
  if (score >= 85) return "high";
  if (score >= 65) return "mid";
  return "low";
}

function ScorePill({ score }: { score: number }) {
  const s = TIER_STYLES[tierFromScore(score)];
  return (
    <span
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {score}%
    </span>
  );
}

const ROLES: Role[] = [
  {
    id: "highlight-liveops",
    title: "LiveOps Manager",
    company: "Highlight",
    location: "Remote (US)",
    workModel: "Remote",
    salary: "$95K – $120K",
    dateParsed: "Today · 09:14",
    score: 96,
    highlights: ["LiveOps", "Mobile Gaming", "Fashion-Tech"],
    mustHave: [
      "3+ years owning LiveOps or in-game economy for a consumer app",
      "Cross-functional coordination across art, engineering, and marketing",
      "Comfort running data-driven live events end-to-end",
    ],
    niceToHave: [
      "Prior fashion or style-commerce exposure",
      "Experience with A/B testing and retention tooling",
    ],
    telegramPreview:
      "🎯 96% match — LiveOps Manager\nHighlight · Remote · $95K–120K\n\nStrong overlap: LiveOps ownership, cross-functional launches, and data-driven event cadence.",
  },
  {
    id: "jamcity-producer",
    title: "Live Games Producer",
    company: "Jam City",
    location: "Los Angeles, CA (Hybrid)",
    workModel: "Hybrid",
    salary: "$90K – $110K",
    dateParsed: "Today · 07:40",
    score: 90,
    highlights: ["Live Games", "Mobile", "Retention"],
    mustHave: [
      "Owns the live event roadmap for a mobile title",
      "Works directly with economy design and analytics",
    ],
    niceToHave: ["Familiarity with player segmentation tooling"],
    telegramPreview:
      "🎯 90% match — Live Games Producer\nJam City · Hybrid · $90K–110K\n\nOverlap on live event ownership and retention-driven roadmap planning.",
  },
  {
    id: "moonactive-analyst",
    title: "Product Analyst",
    company: "Moon Active",
    location: "Tel Aviv, IL",
    workModel: "On-site",
    salary: "₪28K – ₪34K /mo",
    dateParsed: "Yesterday · 18:02",
    score: 84,
    highlights: ["Product Analytics", "Mobile Gaming"],
    mustHave: [
      "SQL fluency for cohort and funnel analysis",
      "Experience partnering with LiveOps or product teams",
    ],
    niceToHave: ["Background in games or entertainment apps"],
    telegramPreview:
      "📊 84% match — Product Analyst\nMoon Active · On-site · Tel Aviv\n\nSolid analytics overlap; seniority and domain both line up well.",
  },
  {
    id: "zalando-growth",
    title: "Growth & Retention Manager",
    company: "Zalando",
    location: "Berlin, DE (Remote)",
    workModel: "Remote",
    salary: "€65K – €80K",
    dateParsed: "Yesterday · 14:15",
    score: 79,
    highlights: ["Retention", "Consumer Fashion"],
    mustHave: ["Owns lifecycle campaigns for a consumer fashion app"],
    niceToHave: ["Experience with push/CRM tooling", "Prior marketplace or D2C experience"],
    telegramPreview:
      "📊 79% match — Growth & Retention Manager\nZalando · Remote · €65K–80K\n\nFashion-consumer overlap is strong; LiveOps-specific ownership is lighter than usual.",
  },
  {
    id: "generic-backend",
    title: "Senior Backend Engineer",
    company: "Generic Systems Inc.",
    location: "Remote (Global)",
    workModel: "Remote",
    salary: "$130K – $150K",
    dateParsed: "2 days ago",
    score: 33,
    highlights: ["Backend", "Distributed Systems"],
    mustHave: ["8+ years in distributed backend systems"],
    niceToHave: [],
    telegramPreview:
      "⚠️ 33% match — Senior Backend Engineer\nGeneric Systems Inc. · Remote\n\nSeniority and scope are outside your target — flagged for visibility only.",
  },
];

const PIPELINE_NODES = [
  { icon: Database, label: "Ingestion" },
  { icon: Sparkles, label: "LLM Scoring" },
  { icon: Send, label: "Telegram Dispatch" },
];

const PRESETS = [
  {
    label: "Fashion Tech",
    text: "LiveOps Manager at an AI-first fashion and mobile gaming studio. Own live events, in-app economy, and cross-functional launches with data-driven experimentation and retention analytics.",
  },
  {
    label: "LiveOps",
    text: "LiveOps Producer responsible for game economy tuning, live event calendar, player retention loops, and analytics-driven decision making for a mobile game studio.",
  },
  {
    label: "Backend",
    text: "Senior Backend Engineer needed with 8+ years experience in distributed systems, Kafka, and Kubernetes for a fintech platform. On-site only.",
  },
];

const POSITIVE_SIGNALS = [
  { kw: ["liveops", "live ops", "live-ops"], label: "LiveOps ownership" },
  { kw: ["mobile game", "mobile gaming", "game economy"], label: "Mobile gaming domain" },
  { kw: ["fashion", "consumer app", "d2c"], label: "Consumer / fashion-tech overlap" },
  { kw: ["cross-functional", "cross functional"], label: "Cross-functional coordination" },
  { kw: ["data-driven", "data driven", "analytics"], label: "Data-driven decision making" },
  { kw: ["retention", "live events", "engagement"], label: "Retention & live-events focus" },
] as const;

const NEGATIVE_SIGNALS = [
  {
    kw: ["8+ years", "10+ years", "senior backend", "distributed systems"],
    label: "Seniority / scope mismatch",
  },
  {
    kw: ["kubernetes", "kafka", "on-site only", "on site only"],
    label: "Infra-heavy, non-LiveOps scope",
  },
] as const;

function scoreJobText(text: string) {
  const lower = text.toLowerCase();
  let score = 52;
  const matched: string[] = [];
  const missed: string[] = [];

  for (const signal of POSITIVE_SIGNALS) {
    if (signal.kw.some((k) => lower.includes(k))) {
      score += 12;
      matched.push(signal.label);
    }
  }
  for (const signal of NEGATIVE_SIGNALS) {
    if (signal.kw.some((k) => lower.includes(k))) {
      score -= 16;
      missed.push(signal.label);
    }
  }

  return { score: Math.max(6, Math.min(98, Math.round(score))), matched, missed };
}

export default function Home() {
  const [selectedId, setSelectedId] = useState(ROLES[0].id);
  const selectedRole = ROLES.find((r) => r.id === selectedId) ?? ROLES[0];

  const [sandboxText, setSandboxText] = useState("");
  const [isScoring, setIsScoring] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<{
    score: number;
    matched: string[];
    missed: string[];
  } | null>(null);

  function runAnalysis(value: string) {
    if (!value.trim()) return;
    setIsScoring(true);
    setSandboxResult(null);
    setTimeout(() => {
      setSandboxResult(scoreJobText(value));
      setIsScoring(false);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#18181B] antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[#E5E5E7] bg-[#FBFBFA]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#18181B]">
              <Sparkles className="h-3.5 w-3.5 text-[#FBFBFA]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tracking-tight">CareerPulse</span>
              <span className="text-[13px] text-slate-400">Alert Agent</span>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[#E5E5E7] bg-white px-3 py-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6B8F73] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6B8F73]" />
            </span>
            <span className="text-xs font-medium text-[#3F6152]">Active</span>
            <span className="text-xs text-slate-400">&middot; Polling every 15m</span>
          </div>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E7] bg-white px-3.5 py-1.5 text-xs font-medium text-[#18181B] transition-colors hover:border-[#18181B]/20 hover:bg-[#F5F5F3]"
          >
            Source Code
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Pipeline ribbon */}
        <div className="border-t border-[#EFEFED]">
          <div className="mx-auto flex max-w-[1180px] items-center justify-center gap-2 px-6 py-2.5 md:px-8">
            {PIPELINE_NODES.map((node, i) => (
              <div key={node.label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-[#F5F5F3] px-2.5 py-1">
                  <node.icon className="h-3 w-3 text-slate-500" />
                  <span className="text-[11px] font-medium text-slate-500">{node.label}</span>
                </div>
                {i < PIPELINE_NODES.length - 1 && <div className="h-px w-6 bg-[#E5E5E7]" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-6 py-8 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#18181B]">Today&rsquo;s feed</h1>
          <p className="mt-1 text-sm text-slate-500">
            {ROLES.length} roles evaluated across your target sources.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Feed */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E5E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="hidden grid-cols-[1.6fr_110px_1.4fr_90px] gap-4 border-b border-[#EFEFED] px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-400 md:grid">
              <span>Role &amp; company</span>
              <span>Parsed</span>
              <span>Highlights</span>
              <span className="text-right">Score</span>
            </div>
            <div className="divide-y divide-[#EFEFED]">
              {ROLES.map((role) => {
                const selected = role.id === selectedId;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedId(role.id)}
                    className={`grid w-full grid-cols-1 gap-2 px-5 py-4 text-left transition-colors md:grid-cols-[1.6fr_110px_1.4fr_90px] md:items-center md:gap-4 ${
                      selected ? "bg-[#F7F7F5]" : "hover:bg-[#FAFAF9]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#18181B]">{role.title}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <Building className="h-3 w-3" /> {role.company}
                        <span className="text-slate-300">&middot;</span>
                        <MapPin className="h-3 w-3" /> {role.location}
                      </p>
                    </div>
                    <div className="hidden items-center gap-1.5 text-xs text-slate-400 md:flex">
                      <Clock className="h-3 w-3" /> {role.dateParsed}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.highlights.slice(0, 2).map((h) => (
                        <span
                          key={h}
                          className="rounded-full border border-[#EFEFED] bg-[#FAFAF9] px-2 py-0.5 text-[11px] text-slate-500"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-2 md:justify-end">
                      <ScorePill score={role.score} />
                      <ChevronRight className="h-4 w-4 text-slate-300 md:hidden" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspector */}
          <aside className="h-fit rounded-2xl border border-[#E5E5E7] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:sticky lg:top-28">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-[#18181B]">
                  {selectedRole.title}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Building className="h-3 w-3" /> {selectedRole.company}
                  <span className="text-slate-300">&middot;</span>
                  <MapPin className="h-3 w-3" /> {selectedRole.location}
                </p>
              </div>
              <ScorePill score={selectedRole.score} />
            </div>

            <div className="my-5 h-px bg-[#EFEFED]" />

            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Fit breakdown
            </p>
            <div className="space-y-3">
              <div>
                <p className="mb-1.5 text-xs font-semibold text-[#3F6152]">Must-have</p>
                <ul className="space-y-1.5">
                  {selectedRole.mustHave.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CircleCheckBig className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6B8F73]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedRole.niceToHave.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-[#5C4F94]">Nice-to-have</p>
                  <ul className="space-y-1.5">
                    {selectedRole.niceToHave.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7C6FC2]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="my-5 h-px bg-[#EFEFED]" />

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#FAFAF9] p-3">
                <Wallet className="h-3.5 w-3.5 text-slate-400" />
                <p className="mt-1.5 text-[11px] text-slate-400">Salary</p>
                <p className="text-xs font-semibold text-[#18181B]">{selectedRole.salary}</p>
              </div>
              <div className="rounded-xl bg-[#FAFAF9] p-3">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <p className="mt-1.5 text-[11px] text-slate-400">Location</p>
                <p className="text-xs font-semibold text-[#18181B]">{selectedRole.location}</p>
              </div>
              <div className="rounded-xl bg-[#FAFAF9] p-3">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                <p className="mt-1.5 text-[11px] text-slate-400">Work model</p>
                <p className="text-xs font-semibold text-[#18181B]">{selectedRole.workModel}</p>
              </div>
            </div>

            <div className="my-5 h-px bg-[#EFEFED]" />

            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Telegram alert preview
            </p>
            <div className="rounded-2xl border border-[#EFEFED] bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2AABEE]">
                    <Send className="h-3 w-3 text-white" />
                  </span>
                  <span className="text-xs font-semibold text-[#18181B]">Job Alert Bot</span>
                </div>
                <span className="text-[11px] text-slate-400">now</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                {selectedRole.telegramPreview}
              </p>
            </div>
          </aside>
        </div>

        {/* Sandbox */}
        <div className="mt-8 rounded-2xl border border-[#E5E5E7] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Quick test
          </p>
          <h3 className="mt-0.5 text-base font-semibold tracking-tight text-[#18181B]">
            See the scorer react in real time
          </h3>

          <div className="mb-3 mt-4 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setSandboxText(preset.text);
                  runAnalysis(preset.text);
                }}
                className="rounded-full border border-[#E5E5E7] bg-[#FAFAF9] px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[#18181B]/20 hover:bg-white"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              value={sandboxText}
              onChange={(e) => setSandboxText(e.target.value)}
              placeholder="Paste a job description, or pick a preset above..."
              rows={2}
              className="flex-1 resize-none rounded-xl border border-[#E5E5E7] bg-[#FAFAF9] px-3.5 py-2.5 text-sm text-[#18181B] outline-none placeholder:text-slate-400 focus:border-[#18181B]/30 focus:bg-white"
            />
            <button
              onClick={() => runAnalysis(sandboxText)}
              disabled={isScoring || !sandboxText.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18181B] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isScoring ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Analyze
            </button>
          </div>

          {sandboxResult && !isScoring && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#EFEFED] bg-[#FAFAF9] p-4 sm:flex-row sm:items-start">
              <ScorePill score={sandboxResult.score} />
              <div className="flex-1 space-y-1.5">
                {sandboxResult.matched.map((m) => (
                  <p key={m} className="flex items-center gap-2 text-xs text-slate-600">
                    <CircleCheckBig className="h-3.5 w-3.5 shrink-0 text-[#6B8F73]" />
                    {m}
                  </p>
                ))}
                {sandboxResult.missed.map((m) => (
                  <p key={m} className="flex items-center gap-2 text-xs text-slate-600">
                    <CircleX className="h-3.5 w-3.5 shrink-0 text-[#C1774E]" />
                    {m}
                  </p>
                ))}
                {sandboxResult.matched.length === 0 && sandboxResult.missed.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No strong signals detected yet — try adding role, domain, or seniority details.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mx-auto max-w-[1180px] px-6 pb-10 pt-2 text-xs text-slate-400 md:px-8">
        Open source on{" "}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-[#18181B]"
        >
          GitHub
        </a>
        . MIT licensed. All roles and scores on this page are illustrative.
      </footer>
    </div>
  );
}
