"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Send } from "lucide-react";

const REPO_URL = "https://github.com/talcaciularu/job-search-alert-agent";
const PROFILE_URL = "https://github.com/talcaciularu";

const FRICTION = [
  "Job boards are fragmented across a dozen open tabs",
  "8+ hours a week lost to manual scrolling and re-checking",
  "Strong roles get buried within hours of being posted",
  "No consistent criteria — every scan is a fresh judgment call",
];

const SOLUTION = [
  "Headless scraping runs unattended, on a schedule, forever",
  "One keyword-and-rules filter applies the exact same criteria every time",
  "New matches are formatted and dispatched the moment they're found",
  "Zero manual triage — only genuine, ranked matches reach the inbox",
];

const STEPS = [
  {
    n: "01",
    title: "Ingestion",
    body: "Scheduled polling across career pages and job-board APIs, normalized into a single structured feed.",
  },
  {
    n: "02",
    title: "Evaluation",
    body: "Every listing is checked against keyword, location, and experience-year rules — the same bar, applied consistently every run.",
  },
  {
    n: "03",
    title: "Dispatch",
    body: "Only new, high-fidelity matches are formatted and pushed — instantly, deduplicated, never sent twice.",
  },
];

const METRICS = [
  { value: "<60s", label: "Alert latency, scrape to ping" },
  { value: "100%", label: "Automated, start to finish" },
  { value: "0", label: "Noise — every match earns its place" },
];

const NOTIFICATIONS = [
  {
    title: "LiveOps Manager",
    source: "Highlight – Careers",
    location: "Remote (US)",
    experience: "3+ yrs required",
    experienceWarning: false,
  },
  {
    title: "Product Analyst",
    source: "Optimove",
    location: "Tel Aviv, IL",
    experience: null,
    experienceWarning: false,
  },
  {
    title: "Business Analyst",
    source: "AllJobs",
    location: null,
    experience: "6+ yrs (above your target)",
    experienceWarning: true,
  },
] as const;

type Phase = "polling" | "evaluating" | "done";

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-purple-200/60 bg-purple-50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-purple-900">
      {children}
    </span>
  );
}

export default function Home() {
  const [runToken, setRunToken] = useState(0);
  const [phase, setPhase] = useState<Phase>("polling");
  const [visibleCount, setVisibleCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function runSimulation() {
    setRunToken((k) => k + 1);
  }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("polling");
    setVisibleCount(0);

    timers.current.push(setTimeout(() => setPhase("evaluating"), 1100));
    timers.current.push(setTimeout(() => setPhase("done"), 2200));
    timers.current.push(setTimeout(() => setVisibleCount(1), 2350));
    timers.current.push(setTimeout(() => setVisibleCount(2), 3050));
    timers.current.push(setTimeout(() => setVisibleCount(3), 3750));

    return () => timers.current.forEach(clearTimeout);
  }, [runToken]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-8 py-8 lg:px-12">
        {/* Hero */}
        <section className="grid gap-10 pb-10 pt-4 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-14 lg:pt-6">
          {/* Left: story */}
          <div>
            <Eyebrow>Project Case Study &middot; Autonomous Workflows</Eyebrow>

            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-[#1A1A1A] sm:text-5xl md:text-[3.25rem]">
              Turning a manual hunt into an automated pipeline.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#5C574C]">
              Job boards are noisy, repetitive, and built for endless scrolling — not for finding
              the one role that actually fits. So I replaced the scrolling with a Python agent
              that watches the listings, checks every one against a defined set of rules, and
              pings me only when something genuinely clears the bar.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-medium text-[#FAF8F5] transition-opacity hover:opacity-85"
              >
                View Code on GitHub
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A] underline decoration-[#D9D3C7] underline-offset-4 transition-colors hover:decoration-[#1A1A1A]"
              >
                Explore Architecture
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: iPhone simulation */}
          <div className="flex flex-col items-center">
            <div className="relative w-[280px] sm:w-[300px]">
              <div className="rounded-[3rem] border-[10px] border-[#1A1A1A] bg-[#1A1A1A] shadow-[0_40px_80px_-28px_rgba(26,26,26,0.35)]">
                <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.25rem] bg-[#FDFCFA]">
                  <div className="absolute left-1/2 top-2.5 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-[#1A1A1A]" />

                  <div className="flex h-full flex-col px-4 pb-6 pt-10">
                    <div className="flex min-h-[34px] items-center gap-2 text-[11px] font-medium text-[#6B6558]">
                      {phase === "polling" && (
                        <>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-70" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-400" />
                          </span>
                          Agent running &middot; Polling career pages...
                        </>
                      )}
                      {phase === "evaluating" && (
                        <div className="w-full">
                          <p className="mb-1.5">Matching against criteria...</p>
                          <div className="h-0.5 w-full overflow-hidden rounded-full bg-[#EAE5DA]">
                            <motion.div
                              key={runToken}
                              className="h-full rounded-full bg-purple-400"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1.05, ease: "easeInOut" }}
                            />
                          </div>
                        </div>
                      )}
                      {phase === "done" && (
                        <span className="text-purple-700">&#10003; 3 matches found</span>
                      )}
                    </div>

                    <div className="mt-2 flex-1 space-y-2">
                      {NOTIFICATIONS.slice(0, visibleCount).map((n, idx) => (
                        <motion.div
                          key={`${runToken}-${idx}`}
                          initial={{ opacity: 0, y: -14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 22 }}
                          className="rounded-2xl border border-[#EAE5DA] bg-white/95 p-3 shadow-[0_8px_20px_-10px_rgba(26,26,26,0.18)]"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2AABEE]">
                              <Send className="h-2 w-2 text-white" />
                            </span>
                            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#A39C8C]">
                              Telegram
                            </span>
                          </div>
                          {n.experience && (
                            <p
                              className={`mt-1.5 text-[10px] font-medium ${
                                n.experienceWarning ? "text-purple-700" : "text-[#6B6558]"
                              }`}
                            >
                              {n.experienceWarning ? "⚠️" : "🧑‍💻"} {n.experience}
                            </p>
                          )}
                          <p className="mt-1 text-[12px] font-semibold leading-snug text-[#1A1A1A]">
                            💼 {n.title}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#8A8578]">📍 {n.source}</p>
                          {n.location && (
                            <p className="text-[10px] text-[#8A8578]">🏙️ {n.location}</p>
                          )}
                          <span className="mt-1 inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-[9px] font-medium text-purple-700">
                            🔗 View posting
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={runSimulation}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E5DFD3] bg-white px-5 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-900"
            >
              Re-run Agent Simulation
              <span aria-hidden>⚡</span>
            </button>
          </div>
        </section>

        {/* The Mindset */}
        <section className="border-t border-[#EAE5DA] py-8 lg:py-10">
          <Eyebrow>The mindset</Eyebrow>
          <h2 className="mt-2 max-w-xl font-serif text-2xl font-semibold leading-snug text-[#1A1A1A] sm:text-3xl">
            Why I built it instead of living with it.
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#E5E1D8] bg-[#F5F3EF] p-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#6B6558]">
                The Friction
              </h3>
              <ul className="mt-4 space-y-3">
                {FRICTION.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#5C574C]">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-purple-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-purple-200 bg-purple-50/30 p-8 shadow-[0_0_0_1px_rgba(196,181,253,0.15),0_20px_36px_-24px_rgba(139,92,246,0.25)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-purple-700">
                The Builder Solution
              </h3>
              <ul className="mt-4 space-y-3">
                {SOLUTION.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#5C574C]">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-purple-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Workflow Architecture */}
        <section id="architecture" className="scroll-mt-16 border-t border-[#EAE5DA] py-8 lg:py-10">
          <Eyebrow>The workflow architecture</Eyebrow>
          <h2 className="mt-2 max-w-xl font-serif text-2xl font-semibold leading-snug text-[#1A1A1A] sm:text-3xl">
            Three quiet steps, running on their own.
          </h2>

          <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:gap-0">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`pt-6 lg:pt-0 ${
                  i > 0 ? "border-t border-[#EAE5DA] lg:border-l lg:border-t-0 lg:pl-12" : ""
                }`}
              >
                <span className="font-serif text-4xl font-light text-purple-300 lg:text-5xl">
                  {step.n}
                </span>
                <h3 className="mt-3 text-base font-semibold text-[#1A1A1A]">{step.title}</h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[#5C574C]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact & Builder Signature */}
        <section className="border-t border-[#EAE5DA] py-8 lg:py-10">
          <Eyebrow>Impact &amp; builder signature</Eyebrow>

          <div className="mt-6 grid gap-6 divide-y divide-[#EAE5DA] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {METRICS.map((m) => (
              <div key={m.label} className="pt-4 sm:pt-0 sm:first:pl-0 sm:pl-8">
                <p className="font-serif text-4xl font-semibold text-[#1A1A1A]">{m.value}</p>
                <p className="mt-1.5 text-sm text-[#6B6558]">{m.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl font-serif text-xl font-normal leading-relaxed text-[#1A1A1A] sm:text-2xl">
            I build tools when something feels slower than it should be.
          </p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#5C574C]">
            This project paired data rigor with a bit of design taste: a scraper that never
            sleeps, a filtering layer built on the same keyword and rule criteria every time, and
            a delivery mechanism built for zero friction — end to end, fast, and considered down
            to the notification copy.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-medium text-[#FAF8F5] transition-opacity hover:opacity-85"
            >
              View the Repository
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#E5DFD3] px-5 py-3 text-sm font-medium text-[#1A1A1A] transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-900"
            >
              Let&rsquo;s Connect
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-[#EAE5DA] py-6 text-xs text-[#8A8578] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Built by <span className="font-semibold text-[#5C574C]">Tal Caciularu</span> —
            bridging operations, data, and design.
          </span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B6558] underline decoration-[#D9D3C7] underline-offset-4 hover:text-[#1A1A1A]"
          >
            View source on GitHub ↗
          </a>
        </footer>
      </div>
    </div>
  );
}
