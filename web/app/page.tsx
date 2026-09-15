"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CircleCheckBig,
  CircleX,
  Database,
  ExternalLink,
  Gauge,
  MapPin,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Workflow,
  Zap,
} from "lucide-react";

const REPO_URL = "https://github.com/talcaciularu/job-search-alert-agent";

type Tone = "emerald" | "amber" | "rose";

type Job = {
  title: string;
  company: string;
  location: string;
  score: number;
  pros: string[];
  cons: string[];
};

const PIPELINE_STEPS = [
  {
    icon: Database,
    title: "Data Fetching",
    description:
      "Scans career pages and job boards on a schedule, pulling every listing from your configured sources.",
  },
  {
    icon: Sparkles,
    title: "AI Evaluation & Scoring",
    description:
      "Each listing is scored against your keywords, seniority range, and location preferences.",
  },
  {
    icon: Send,
    title: "Automated Telegram Dispatch",
    description:
      "Only new, high-match roles get pushed to your phone — duplicates are never sent twice.",
  },
];

const FEATURED_JOBS: Job[] = [
  {
    title: "LiveOps Manager",
    company: "Playtika",
    location: "Herzliya, IL",
    score: 94,
    pros: [
      "Title matches your target keywords exactly",
      "Experience range fits your profile",
      "Located in a preferred region",
    ],
    cons: ["No remote option listed"],
  },
  {
    title: "Product Analyst",
    company: "Optimove",
    location: "Tel Aviv, IL",
    score: 88,
    pros: ["Strong keyword + domain overlap", "Team size and stage match preference"],
    cons: ["Requires an advanced SQL certification", "Seniority slightly ambiguous"],
  },
  {
    title: "Senior Backend Engineer",
    company: "Generic Corp",
    location: "Remote (US)",
    score: 37,
    pros: ["Compensation range disclosed upfront"],
    cons: [
      "Seniority exceeds your target range",
      "Location outside your preferences",
      "No overlap with your keyword list",
    ],
  },
];

const SANDBOX_JOBS: Job[] = [
  {
    title: "Junior Data Analyst",
    company: "Nym Health",
    location: "Tel Aviv, IL",
    score: 91,
    pros: ["Junior seniority matches exactly", "Health-tech domain you've flagged as a priority"],
    cons: ["Ambiguous mention of on-call rotations"],
  },
  {
    title: "Operations Manager",
    company: "Papaya Global",
    location: "Herzliya, IL",
    score: 76,
    pros: ["Keyword match on title", "Location within target region"],
    cons: ["Requires 5+ years — above your stated range"],
  },
  {
    title: "Business Analyst",
    company: "Cellebrite",
    location: "Singapore",
    score: 52,
    pros: ["Title partially matches keyword list"],
    cons: ["Outside your target locations", "No mention of required tooling"],
  },
  {
    title: "Marketing Coordinator",
    company: "Generic Ltd.",
    location: "Remote (EU)",
    score: 21,
    pros: [],
    cons: ["No keyword overlap", "Seniority and domain both mismatched"],
  },
];

function toneFromScore(score: number): Tone {
  if (score >= 80) return "emerald";
  if (score >= 55) return "amber";
  return "rose";
}

function verdictFromScore(score: number) {
  if (score >= 80) return "Strong match";
  if (score >= 55) return "Possible match";
  return "Low match";
}

const TONE_CLASSES: Record<
  Tone,
  { text: string; ring: string; bg: string; track: string; chip: string }
> = {
  emerald: {
    text: "text-emerald-400",
    ring: "ring-emerald-500/25",
    bg: "bg-emerald-500/10",
    track: "#34d399",
    chip: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  amber: {
    text: "text-amber-400",
    ring: "ring-amber-500/25",
    bg: "bg-amber-500/10",
    track: "#fbbf24",
    chip: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  rose: {
    text: "text-rose-400",
    ring: "ring-rose-500/25",
    bg: "bg-rose-500/10",
    track: "#fb7185",
    chip: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
};

function ScoreRing({ score }: { score: number }) {
  const tone = TONE_CLASSES[toneFromScore(score)];
  return (
    <div
      className="relative h-16 w-16 shrink-0 rounded-full"
      style={{
        background: `conic-gradient(${tone.track} ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
      }}
    >
      <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-[#0c0c10] text-sm font-semibold text-zinc-100">
        {score}%
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const tone = TONE_CLASSES[toneFromScore(job.score)];
  const verdict = verdictFromScore(job.score);
  const VerdictIcon = job.score >= 55 ? ThumbsUp : ThumbsDown;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-50">{job.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
            <Briefcase className="h-3.5 w-3.5" />
            {job.company}
            <span className="text-zinc-600">&middot;</span>
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </p>
        </div>
        <ScoreRing score={job.score} />
      </div>

      <div
        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tone.chip}`}
      >
        <VerdictIcon className="h-3.5 w-3.5" />
        {verdict}
      </div>

      {job.pros.length > 0 && (
        <ul className="space-y-1.5">
          {job.pros.map((pro) => (
            <li key={pro} className="flex items-start gap-2 text-sm text-zinc-300">
              <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              {pro}
            </li>
          ))}
        </ul>
      )}
      {job.cons.length > 0 && (
        <ul className="space-y-1.5">
          {job.cons.map((con) => (
            <li key={con} className="flex items-start gap-2 text-sm text-zinc-400">
              <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              {con}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const TECH_BADGES = [
  { icon: Terminal, label: "Python" },
  { icon: Sparkles, label: "AI Parsing" },
  { icon: Send, label: "Telegram API" },
];

export default function Home() {
  const [sandboxTitle, setSandboxTitle] = useState(SANDBOX_JOBS[0].title);
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState<Job | null>(null);

  function runSimulation() {
    const picked = SANDBOX_JOBS.find((job) => job.title === sandboxTitle) ?? SANDBOX_JOBS[0];
    setIsScoring(true);
    setResult(null);
    setTimeout(() => {
      setResult(picked);
      setIsScoring(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {/* Header */}
        <header className="flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            Runs unattended on a schedule
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Job Search Alert Agent
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
            A self-hosted bot that scans career pages, scores every listing against your goals,
            and pings you on Telegram the moment a genuine match appears.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {TECH_BADGES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-300"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
          >
            View on GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        </header>

        {/* Pipeline architecture */}
        <section className="mt-20">
          <div className="mb-6 flex items-center gap-2">
            <Workflow className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-zinc-50">Pipeline architecture</h2>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.title} className="contents">
                <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <step.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-50">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{step.description}</p>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden items-center justify-center sm:flex">
                    <ArrowRight className="h-5 w-5 text-zinc-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive demo */}
        <section className="mt-20">
          <div className="mb-6 flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-zinc-50">Interactive demo</h2>
          </div>
          <p className="mb-6 max-w-2xl text-sm text-zinc-400">
            These are sample listings showing how the agent scores and explains each match. All
            data on this page is mocked — no live scan runs here.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURED_JOBS.map((job) => (
              <JobCard key={job.title} job={job} />
            ))}
          </div>

          {/* Sandbox */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-zinc-50">Sandbox: simulate the scorer</h3>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={sandboxTitle}
                onChange={(e) => {
                  setSandboxTitle(e.target.value);
                  setResult(null);
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-500/40"
              >
                {SANDBOX_JOBS.map((job) => (
                  <option key={job.title} value={job.title} className="bg-zinc-900">
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>

              <button
                onClick={runSimulation}
                disabled={isScoring}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isScoring ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Scoring...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run AI scoring
                  </>
                )}
              </button>
            </div>

            <div className="mt-5">
              {isScoring && (
                <div className="animate-pulse rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-zinc-500">
                  Evaluating keywords, seniority, and location against your profile...
                </div>
              )}
              {!isScoring && result && (
                <div className="max-w-sm">
                  <JobCard job={result} />
                </div>
              )}
              {!isScoring && !result && (
                <div className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-zinc-500">
                  Pick a listing above and click &ldquo;Run AI scoring&rdquo; to see a simulated
                  result.
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-20 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-zinc-500">
          <p>
            Open source on{" "}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-100"
            >
              GitHub
            </a>
            . MIT licensed.
          </p>
        </footer>
      </div>
    </div>
  );
}
