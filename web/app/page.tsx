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
  "One LLM-driven scorer applies the exact same criteria every time",
  "New matches are formatted and dispatched the moment they're found",
  "Zero manual triage — only genuine, ranked matches reach the inbox",
];

const STEPS = [
  {
    n: "01",
    title: "Ingestion",
    body: "Scheduled polling across career pages and job-board APIs, normalized into a single structured feed — no manual refreshing required.",
  },
  {
    n: "02",
    title: "Evaluation",
    body: "A structured prompt extracts seniority, role impact, and stack overlap, then scores fit against a defined profile — the same bar, applied consistently.",
  },
  {
    n: "03",
    title: "Dispatch",
    body: "Only new, high-fidelity matches are formatted and pushed — instantly, deduplicated, and never sent twice.",
  },
];

const OUTCOMES = [
  { value: "100%", label: "Automated", caption: "No manual triage required, start to finish." },
  { value: "0", label: "Duplicates", caption: "Every match is deduplicated before it reaches you." },
  { value: "<60s", label: "Alert latency", caption: "From detection to push notification." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-[#1B1A17]">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {/* Folio */}
        <div className="flex items-center justify-between pt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#9C9686]">
          <span>Case Study / 01</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6B6558] transition-colors hover:text-[#1B1A17]"
          >
            GitHub
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {/* Hero */}
        <section className="pb-24 pt-16 md:pb-32 md:pt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE8E3] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8A8578]">
            Project Case Study &middot; Autonomous Workflows
          </div>

          <h1 className="mt-8 max-w-3xl font-serif text-4xl font-normal leading-[1.15] tracking-tight text-[#1B1A17] sm:text-5xl md:text-6xl">
            Turning a manual hunt into an automated pipeline.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#6B6558]">
            Job boards are noisy and uncurated. Instead of endless manual scrolling, I built an
            end-to-end Python &amp; AI agent that monitors listings, scores match fidelity, and
            pushes instant alerts to Telegram.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1B1A17] px-5 py-3 text-sm font-medium text-[#FAF9F6] transition-opacity hover:opacity-85"
            >
              View Code on GitHub
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#architecture"
              className="inline-flex items-center gap-2 rounded-full border border-[#EAE8E3] px-5 py-3 text-sm font-medium text-[#1B1A17] transition-colors hover:border-[#1B1A17]/30 hover:bg-white"
            >
              Explore Architecture
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Friction vs Solution */}
        <section className="border-t border-[#EAE8E3] py-20 md:py-28">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9C9686]">
            The mindset
          </p>
          <h2 className="mt-3 max-w-lg font-serif text-2xl font-normal leading-snug text-[#1B1A17] sm:text-3xl">
            Why I built it instead of living with it.
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#9C9686]">
                The Friction
              </h3>
              <ul className="mt-5 space-y-4">
                {FRICTION.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#6B6558]">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#C9C3B4]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-[#EAE8E3] pt-10 md:border-t-0 md:border-l md:pl-16 md:pt-0">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#9C7A5C]">
                The Builder Solution
              </h3>
              <ul className="mt-5 space-y-4">
                {SOLUTION.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#1B1A17]">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#B5714B]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="scroll-mt-16 border-t border-[#EAE8E3] py-20 md:py-28">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9C9686]">
            The workflow
          </p>
          <h2 className="mt-3 max-w-lg font-serif text-2xl font-normal leading-snug text-[#1B1A17] sm:text-3xl">
            Three quiet steps, running on their own.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`pt-8 md:pt-0 ${
                  i > 0 ? "border-t border-[#EAE8E3] md:border-l md:border-t-0 md:pl-10" : ""
                }`}
              >
                <span className="font-serif text-4xl font-light text-[#D9D3C7] md:text-5xl">
                  {step.n}
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#1B1A17]">{step.title}</h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[#6B6558]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Product in Action */}
        <section className="border-t border-[#EAE8E3] py-20 md:py-28">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9C9686]">
            The product, in action
          </p>
          <h2 className="mt-3 max-w-lg font-serif text-2xl font-normal leading-snug text-[#1B1A17] sm:text-3xl">
            What actually lands on your phone.
          </h2>

          <div className="mx-auto mt-14 max-w-xs">
            <div className="relative rounded-[2.5rem] border border-[#EAE8E3] bg-gradient-to-b from-white to-[#F5F3EE] p-3 shadow-[0_30px_60px_-24px_rgba(27,26,23,0.18)]">
              <div className="rounded-[2rem] bg-[#FAF9F6] px-4 pb-8 pt-7">
                <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-[#EAE8E3]" />

                <div className="rounded-2xl border border-[#EAE8E3] bg-white/95 p-4 shadow-[0_8px_24px_rgba(27,26,23,0.08)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2AABEE]">
                        <Send className="h-2.5 w-2.5 text-white" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8A8578]">
                        Telegram
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A39C8C]">now</span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-[#1B1A17]">
                    🎯 96% Match — LiveOps Manager
                  </p>
                  <p className="mt-1 text-xs text-[#8A8578]">Highlight &middot; Remote &middot; $95K–120K</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#6B6558]">
                    Strong overlap: LiveOps ownership, cross-functional launches, and
                    data-driven event cadence.
                  </p>
                  <p className="mt-2 text-xs font-medium text-[#B5714B]">View listing ↗</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[#EAE8E3] bg-[#EAE8E3] sm:grid-cols-3">
            {OUTCOMES.map((outcome) => (
              <div key={outcome.label} className="bg-[#FDFCFA] p-7">
                <p className="font-serif text-3xl font-normal text-[#1B1A17]">{outcome.value}</p>
                <p className="mt-1 text-sm font-semibold text-[#1B1A17]">{outcome.label}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#8A8578]">{outcome.caption}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About & Connect */}
        <section className="border-t border-[#EAE8E3] py-20 md:py-28">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9C9686]">
            About the builder
          </p>
          <p className="mt-5 max-w-2xl font-serif text-xl font-normal leading-relaxed text-[#1B1A17] sm:text-2xl">
            I build tools when something feels slower than it should be.
          </p>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#6B6558]">
            This project paired data rigor with a bit of design taste: a scraper that never
            sleeps, a scoring layer that thinks in structured criteria, and a delivery mechanism
            built for zero friction. It&rsquo;s a small system, but it&rsquo;s exactly the kind of
            thing I like shipping — end to end, fast, and considered down to the notification
            copy.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1B1A17] px-5 py-3 text-sm font-medium text-[#FAF9F6] transition-opacity hover:opacity-85"
            >
              View the Repository
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#EAE8E3] px-5 py-3 text-sm font-medium text-[#1B1A17] transition-colors hover:border-[#1B1A17]/30 hover:bg-white"
            >
              Let&rsquo;s Connect
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-[#EAE8E3] py-10 text-xs text-[#9C9686] sm:flex-row sm:items-center sm:justify-between">
          <span>Built end-to-end with Python, an LLM scoring layer, and the Telegram Bot API.</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B6558] underline decoration-[#D9D3C7] underline-offset-4 hover:text-[#1B1A17]"
          >
            View source on GitHub ↗
          </a>
        </footer>
      </div>
    </div>
  );
}
