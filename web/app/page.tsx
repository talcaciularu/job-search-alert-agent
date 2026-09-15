"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CircleCheckBig, Send } from "lucide-react";

const REPO_URL = "https://github.com/talcaciularu/job-search-alert-agent";

const NOTIFICATION_BULLETS = [
  "LiveOps ownership match",
  "Cross-functional scope aligned",
  "Fashion + gaming domain fit",
];

const METRICS = [
  { value: "100%", label: "Automated pipeline", dot: "#7C6FC2" },
  { value: "<60s", label: "Latency, scrape to ping", dot: "#B5714B" },
  { value: "0", label: "Duplicates ever delivered", dot: "#6B8F73" },
];

const PIPELINE = [
  {
    title: "Polling",
    tag: "PyCharm / Python script",
    caption: "Scheduled checks across career pages and job-board APIs.",
  },
  {
    title: "AI Evaluation",
    tag: "Context & strict schema scoring",
    caption: "Seniority, role impact, and stack overlap scored consistently.",
  },
  {
    title: "Push Dispatch",
    tag: "Telegram Bot API",
    caption: "Formatted, deduplicated alerts sent the moment a match clears the bar.",
  },
];

const MATCH_TARGET = 96;

function Bento({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-[28px] border p-6 shadow-[0_1px_2px_rgba(28,28,30,0.04)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_28px_-10px_rgba(28,28,30,0.14)] md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

const metricsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const metricItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const [pingKey, setPingKey] = useState(0);
  const [matchPercent, setMatchPercent] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function scheduleLoop() {
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = setInterval(() => {
      setPingKey((k) => k + 1);
    }, 6000);
  }

  function handleManualPing() {
    setPingKey((k) => k + 1);
    scheduleLoop();
  }

  useEffect(() => {
    scheduleLoop();
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMatchPercent(0);
    setIsPulsing(true);
    const pulseTimeout = setTimeout(() => setIsPulsing(false), 900);

    let current = 0;
    const countInterval = setInterval(() => {
      current = Math.min(MATCH_TARGET, current + 4);
      setMatchPercent(current);
      if (current >= MATCH_TARGET) clearInterval(countInterval);
    }, 18);

    return () => {
      clearInterval(countInterval);
      clearTimeout(pulseTimeout);
    };
  }, [pingKey]);

  return (
    <div className="min-h-screen bg-[#F9F9F8] font-sans text-[#1C1C1E]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {/* Card A — Hero / Narrative */}
          <Bento className="flex h-full flex-col justify-between bg-[#F4F1EA] border-[#E8E4DA] md:col-span-2">
            <div>
              <span className="inline-flex items-center rounded-full border border-[#DAD4C4] bg-white/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B6558]">
                Project Case Study &middot; Autonomous Workflows
              </span>
              <h1 className="mt-6 font-serif text-3xl font-normal leading-[1.15] tracking-tight text-[#1C1C1E] sm:text-4xl md:text-[2.75rem]">
                Turning a manual hunt into an automated pipeline.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#5C574C]">
                Job boards are noisy, repetitive, and allergic to good UX. So I built a small
                Python agent that handles the boring part — scanning, scoring, and pinging —
                while I do literally anything else.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#1C1C1E] px-5 py-3 text-sm font-medium text-[#F9F9F8] transition-opacity hover:opacity-85"
              >
                View Code on GitHub
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <span className="inline-flex items-center rounded-full border border-[#DAD4C4] bg-white/40 px-4 py-2.5 text-xs font-medium text-[#6B6558]">
                Stack: Python &middot; LLM &middot; Telegram
              </span>
            </div>
          </Bento>

          {/* Card B — Animated Notification */}
          <Bento className="flex h-full flex-col bg-[#F3F0F8] border-[#E4DEF0]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#7A6FA0]">
                Live Preview
              </span>
              <button
                onClick={handleManualPing}
                className="inline-flex items-center gap-1 rounded-full border border-[#D9D0EE] bg-white/60 px-2.5 py-1 text-[11px] font-medium text-[#5B4F94] transition-colors hover:bg-white"
              >
                Trigger Ping
                <span aria-hidden>⚡</span>
              </button>
            </div>

            <div className="mt-6 flex flex-1 items-center justify-center">
              <div className={`w-full ${isPulsing ? "animate-[bento-pulse_0.9s_ease-out]" : ""}`}>
                <motion.div
                  key={pingKey}
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="rounded-2xl border border-[#E4DEF0] bg-white/95 p-4 shadow-[0_10px_30px_-12px_rgba(91,79,148,0.25)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2AABEE]">
                      <Send className="h-2.5 w-2.5 text-white" />
                    </span>
                    <span className="text-[11px] font-semibold text-[#6B6558]">
                      Telegram &middot; Just now
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-snug text-[#1C1C1E]">
                    🎯 {matchPercent}% Match: LiveOps Manager at Highlight
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {NOTIFICATION_BULLETS.map((b) => (
                      <li key={b} className="flex items-center gap-1.5 text-xs text-[#6B6558]">
                        <CircleCheckBig className="h-3 w-3 shrink-0 text-emerald-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </Bento>

          {/* Card C — Mindset / Builder Quote */}
          <Bento className="flex h-full flex-col justify-between bg-[#EFF5F0] border-[#DCE8DE]">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5E7A63]">
                The mindset
              </span>
              <p className="mt-4 font-serif text-xl italic leading-snug text-[#1C1C1E] sm:text-[1.35rem]">
                &ldquo;When a process is slow or manual, you don&rsquo;t open a ticket. You build
                the script that kills it.&rdquo;
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/60 px-3 py-1.5 text-xs font-medium text-[#8A8578] line-through decoration-[#C9C3B4]">
                Manual: 8h/week lost
              </span>
              <span className="text-xs text-[#9C9686]">vs</span>
              <span className="rounded-full bg-[#5E7A63] px-3 py-1.5 text-xs font-medium text-white">
                Agent: 0 manual triage
              </span>
            </div>
          </Bento>

          {/* Card D — Metrics & Impact */}
          <Bento className="bg-[#FDF1EC] border-[#F6DDD3]">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#B0714E]">
              Metrics &amp; impact
            </span>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={metricsContainer}
              className="mt-5 space-y-4"
            >
              {METRICS.map((m) => (
                <motion.div key={m.label} variants={metricItem} className="flex items-baseline gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: m.dot }} />
                  <span className="font-serif text-2xl text-[#1C1C1E]">{m.value}</span>
                  <span className="text-xs text-[#8A6650]">{m.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </Bento>

          {/* Card E — Live Architecture Stream */}
          <Bento className="bg-[#EFF4F9] border-[#DBE6F2]">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#4F6E94]">
              Live architecture
            </span>
            <div className="mt-5">
              {PIPELINE.map((step, i) => (
                <div key={step.title} className="relative flex gap-3 pb-6 last:pb-0">
                  {i < PIPELINE.length - 1 && (
                    <span className="absolute left-[5px] top-3 h-full w-px bg-[#C9D8E8]" />
                  )}
                  <span className="relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#4F6E94]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1C1C1E]">{step.title}</p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[#7C93AC]">
                      {step.tag}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#6B7C8F]">{step.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </Bento>

          {/* Row 3 — Footer Banner */}
          <Bento className="flex flex-col items-start justify-between gap-4 bg-[#1C1C1E] border-[#1C1C1E] sm:flex-row sm:items-center md:col-span-3">
            <p className="text-sm text-[#F9F9F8]">
              Built by <span className="font-semibold">Tal Caciularu</span> — bridging operations,
              data, and design.
            </p>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-[#F9F9F8] transition-colors hover:bg-white/10"
            >
              View Repository
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Bento>
        </div>
      </div>
    </div>
  );
}
