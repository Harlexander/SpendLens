import Link from "next/link";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";
import { ArrowRight, Star, ChevronRight } from "lucide-react";

// ── Dashboard illustration ─────────────────────────────────────────────────

function DashboardMockup() {
  const bars = [32, 54, 38, 72, 48, 88, 56, 78, 44, 92, 68, 84];
  const txns = [
    { icon: "🎬", name: "Netflix", tag: "Subscription", amount: "-₦4,900", neg: true },
    { icon: "💼", name: "Salary Credit", tag: "Income", amount: "+₦420,000", neg: false },
    { icon: "🛒", name: "Shoprite", tag: "Groceries", amount: "-₦18,400", neg: true },
  ];

  return (
    <div className="relative w-full max-w-[420px]">
      {/* background glow */}
      <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="animate-float relative rounded-2xl border border-border bg-card p-5 shadow-2xl">
        {/* header row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
            <p className="text-2xl font-bold text-foreground">
              ₦1,240,<span className="text-primary">563</span>
            </p>
          </div>
          {/* ring chart */}
          <div className="relative h-14 w-14 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" strokeWidth="13"
                stroke="currentColor" className="text-white/8" />
              <circle cx="50" cy="50" r="38" fill="none" strokeWidth="13"
                strokeDasharray="178 239" strokeLinecap="round"
                stroke="currentColor" className="text-primary" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">74%</span>
            </div>
          </div>
        </div>

        {/* income / expense pills */}
        <div className="flex gap-2 mb-5">
          {[
            { label: "Income", value: "₦420k", color: "bg-primary/15 text-primary" },
            { label: "Expenses", value: "₦178k", color: "bg-white/8 text-muted-foreground" },
          ].map((p) => (
            <div key={p.label} className={`flex-1 rounded-xl px-3 py-2 ${p.color}`}>
              <p className="text-[10px] opacity-70 mb-0.5">{p.label}</p>
              <p className="text-sm font-semibold">{p.value}</p>
            </div>
          ))}
        </div>

        {/* transactions */}
        <div className="space-y-3 mb-5">
          {txns.map((tx) => (
            <div key={tx.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-white/8 flex items-center justify-center text-sm">
                  {tx.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{tx.name}</p>
                  <p className="text-[10px] text-muted-foreground">{tx.tag}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold ${tx.neg ? "text-foreground/70" : "text-primary"}`}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>

        {/* bar chart */}
        <div className="flex items-end gap-[3px] h-10">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-[2px] transition-all ${
                i === 9 ? "bg-primary" : "bg-white/10"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-muted-foreground">Jan</span>
          <span className="text-[9px] text-muted-foreground">Dec</span>
        </div>
      </div>

      {/* floating badge */}
      <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-xl animate-fade-in delay-500">
        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
          AI
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Insight</p>
          <p className="text-xs font-semibold text-foreground">Save ₦34k/mo</p>
        </div>
      </div>
    </div>
  );
}

// ── Feature card chart illustrations ──────────────────────────────────────

function RingChart({ pct }: { pct: number }) {
  const circ = 2 * Math.PI * 38;
  return (
    <div className="relative h-14 w-14">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="38" fill="none" strokeWidth="13"
          stroke="currentColor" className="text-white/8" />
        <circle cx="50" cy="50" r="38" fill="none" strokeWidth="13"
          strokeDasharray={`${circ * pct / 100} ${circ}`} strokeLinecap="round"
          stroke="currentColor" className="text-primary" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-primary">{pct}%</span>
      </div>
    </div>
  );
}

function BarChart({ data }: { data: number[] }) {
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((h, i) => (
        <div key={i}
          className={`flex-1 rounded-[2px] ${i === data.length - 1 ? "bg-primary" : "bg-white/10"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function LineChart() {
  return (
    <svg className="w-full h-10" viewBox="0 0 200 48" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points="0,38 25,30 50,33 75,18 100,22 130,10 160,6 200,9 200,48 0,48"
        fill="url(#lineGrad)" className="text-primary"
      />
      <polyline
        points="0,38 25,30 50,33 75,18 100,22 130,10 160,6 200,9"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="text-primary"
      />
    </svg>
  );
}

function MiniDonut() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* 45% */}
          <circle cx="50" cy="50" r="38" fill="none" strokeWidth="20"
            stroke="currentColor" className="text-primary"
            strokeDasharray="107 144" strokeDashoffset="-38" />
          {/* 30% */}
          <circle cx="50" cy="50" r="38" fill="none" strokeWidth="20"
            stroke="currentColor" className="text-blue-400"
            strokeDasharray="71 180" strokeDashoffset="-145" />
          {/* 25% */}
          <circle cx="50" cy="50" r="38" fill="none" strokeWidth="20"
            stroke="currentColor" className="text-purple-400"
            strokeDasharray="59 192" strokeDashoffset="-216" />
        </svg>
      </div>
      <div className="space-y-1 text-[10px]">
        {[
          { label: "Food", color: "bg-primary" },
          { label: "Bills", color: "bg-blue-400" },
          { label: "Fun", color: "bg-purple-400" },
        ].map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${c.color}`} />
            <span className="text-muted-foreground">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Phone frame for feature sections ──────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-52">
      <div className="absolute -inset-6 rounded-full bg-primary/8 blur-2xl pointer-events-none" />
      <div className="relative rounded-[2.5rem] border-2 border-border bg-card overflow-hidden shadow-2xl">
        {/* notch */}
        <div className="flex justify-center pt-3 pb-0">
          <div className="h-5 w-24 rounded-full bg-background" />
        </div>
        <div className="px-4 pb-6 pt-2">{children}</div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const features = [
    {
      title: "Goal Saving",
      desc: "Set targets and track your progress with visual milestones.",
      chart: <div className="flex justify-center"><RingChart pct={68} /></div>,
    },
    {
      title: "Financial Reports",
      desc: "Beautiful charts that show where your money goes every month.",
      chart: <LineChart />,
    },
    {
      title: "Expense Tracking",
      desc: "Every transaction categorized automatically by AI.",
      chart: <BarChart data={[40, 65, 30, 75, 50, 90, 45, 80, 55, 70]} />,
    },
    {
      title: "Budget Managing",
      desc: "Allocate budgets per category and get alerts when you overspend.",
      chart: <MiniDonut />,
    },
    {
      title: "Total Portfolio",
      desc: "Get a bird's-eye view of income, expenses, and net worth trends.",
      chart: <BarChart data={[50, 38, 62, 44, 80, 55, 91, 60, 73, 85]} />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28">
        {/* subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.87 0.25 128) 1px, transparent 1px), linear-gradient(90deg, oklch(0.87 0.25 128) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* radial glow */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 60% at 75% 50%, oklch(0.87 0.25 128 / 0.07) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center gap-16">
          {/* left text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              AI-Powered · Free to Start
            </div>

            <h1 className="animate-fade-in-up delay-100 text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Master your<br />
              Finances with<br />
              <span className="text-primary">SpendLens</span>
            </h1>

            <p className="animate-fade-in-up delay-200 text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
              Upload any bank statement and get a full breakdown of your spending,
              top recipients, fees, and savings opportunities — in under 30 seconds.
            </p>

            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/upload"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-primary text-primary-foreground hover:opacity-90 shadow-md gap-2 transition-opacity"
                )}
              >
                Analyze My Statement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-border/60 text-foreground gap-2"
                )}
              >
                How it works
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="animate-fade-in-up delay-400 mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              {["No account required", "Bank-grade encryption", "Data never stored"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* right illustration */}
          <div className="animate-fade-in delay-300 flex-1 flex justify-center lg:justify-end">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <section className="border-y border-border py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "12,000+", label: "Users analyzed" },
              { value: "2M+", label: "Transactions processed" },
              { value: "4.9 ★", label: "Average rating" },
              { value: "< 30s", label: "Analysis time" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cutting-Edge Features ─────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs text-primary font-medium mb-4">
              Features
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">Cutting-Edge Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to understand your money — automatic, instant, and private.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors ${
                  i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="mb-4">{f.chart}</div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature detail 1 ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 order-2 lg:order-1">
              <PhoneFrame>
                <p className="text-[10px] text-muted-foreground mb-2">Monthly Spend</p>
                <p className="text-base font-bold text-foreground mb-3">₦178,400</p>
                <BarChart data={[30, 55, 42, 68, 50, 85, 45, 72, 38, 90, 60, 75]} />
                <div className="mt-4 space-y-2">
                  {[
                    { label: "Food & Dining", pct: 42, color: "bg-primary" },
                    { label: "Transport", pct: 28, color: "bg-blue-400" },
                    { label: "Bills", pct: 18, color: "bg-purple-400" },
                  ].map((c) => (
                    <div key={c.label}>
                      <div className="flex justify-between text-[9px] mb-0.5">
                        <span className="text-muted-foreground">{c.label}</span>
                        <span className="text-foreground">{c.pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct * 2}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </PhoneFrame>
            </div>

            <div className="flex-1 order-1 lg:order-2">
              <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary font-medium mb-5">
                Expense Tracking
              </span>
              <h2 className="text-4xl font-bold text-foreground mb-5 leading-tight">
                Identify areas to cut costs<br />and save more money
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                SpendLens automatically categorizes every single transaction — dining, transport, subscriptions,
                fees, and more. See exactly what's draining your account in seconds.
              </p>
              <Link href="/upload" className={cn(buttonVariants({}), "bg-primary text-primary-foreground hover:opacity-90 gap-2 transition-opacity")}>
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature detail 2 ──────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary font-medium mb-5">
                Financial Overview
              </span>
              <h2 className="text-4xl font-bold text-foreground mb-5 leading-tight">
                Gain peace of mind keeping<br />all your finances organized
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                See your top senders, recipients, fees, and unusual charges — all in one
                clean dashboard. No more digging through statements line by line.
              </p>
              <Link href="/upload" className={cn(buttonVariants({}), "bg-primary text-primary-foreground hover:opacity-90 gap-2 transition-opacity")}>
                Try for free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex-1">
              <PhoneFrame>
                <p className="text-[10px] text-muted-foreground mb-2">Top Recipients</p>
                <div className="space-y-2.5">
                  {[
                    { name: "John Doe", amount: "₦85,000", count: "12×" },
                    { name: "Ada Williams", amount: "₦42,500", count: "7×" },
                    { name: "Bolt Nigeria", amount: "₦28,000", count: "23×" },
                    { name: "Spotify", amount: "₦5,880", count: "3×" },
                  ].map((r, i) => (
                    <div key={r.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-foreground">{r.name}</p>
                          <p className="text-[9px] text-muted-foreground">{r.count}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-foreground/80">{r.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-muted-foreground">Total sent out</span>
                    <span className="text-primary font-semibold">₦161,380</span>
                  </div>
                </div>
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature detail 3 ──────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 order-2 lg:order-1">
              <PhoneFrame>
                <p className="text-[10px] text-muted-foreground mb-1">Statement Analysis</p>
                <p className="text-base font-bold text-foreground mb-3">Full Report</p>
                <div className="flex justify-center mb-4">
                  <RingChart pct={82} />
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Income", value: "₦420k", color: "text-primary" },
                    { label: "Expenses", value: "₦178k", color: "text-foreground/60" },
                    { label: "Net flow", value: "+₦242k", color: "text-primary" },
                    { label: "Bank fees", value: "₦3,240", color: "text-orange-400" },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className={`font-semibold ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </PhoneFrame>
            </div>

            <div className="flex-1 order-1 lg:order-2">
              <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary font-medium mb-5">
                AI Reports
              </span>
              <h2 className="text-4xl font-bold text-foreground mb-5 leading-tight">
                Achieve better financial<br />health with detailed reports
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our AI analyzes every transaction and returns a structured report: spending categories,
                fee breakdown, net cash flow, busiest days, and unidentified charges — all actionable.
              </p>
              <Link href="/upload" className={cn(buttonVariants({}), "bg-primary text-primary-foreground hover:opacity-90 gap-2 transition-opacity")}>
                See a sample report <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>

          <blockquote className="text-2xl lg:text-3xl font-medium text-foreground leading-relaxed mb-8">
            &ldquo;SpendLens completely transformed how I handle my finances. It found ₦18k/month in
            subscriptions I had forgotten about. Absolutely worth it.&rdquo;
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              AM
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Alexandra M.</p>
              <p className="text-xs text-muted-foreground">Freelance Designer, Lagos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-border">
        <div className="relative mx-auto max-w-3xl px-6 text-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.87 0.25 128 / 0.07) 0%, transparent 70%)" }}
          />
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs text-primary font-medium mb-6">
            Get started today — it&apos;s free
          </span>
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Take control of<br />
            <span className="text-primary">your money</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10">
            Upload your bank statement and see exactly where your money goes — no account needed,
            no data stored.
          </p>
          <Link
            href="/upload"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary text-primary-foreground hover:opacity-90 shadow-lg gap-2 px-10 transition-opacity"
            )}
          >
            Analyze My Statement <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary-foreground">SL</span>
              </div>
              <span className="font-semibold text-foreground">
                Spend<span className="text-primary">Lens</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {["Privacy", "Terms", "Security", "Contact"].map((l) => (
                <Link key={l} href="#" className="hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">&copy; 2026 SpendLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
