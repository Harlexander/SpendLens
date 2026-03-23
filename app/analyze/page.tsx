"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import {
  BarChart2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Hash,
  CalendarDays,
  Users,
  Receipt,
  HelpCircle,
  Tag,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type CategoryTransaction = {
  date: string;
  description: string;
  amount: number;
  reference: string;
};

type Category = {
  total_spent: number;
  count: number;
  transactions: CategoryTransaction[];
};

type AnalysisResult = {
  summary: {
    total_income: number;
    total_expenses: number;
    net_cash_flow: number;
    transaction_count: number;
    period_start: string;
    period_end: string;
  };
  spending_days: {
    most_spent: {
      date: string;
      total: number;
      transaction_count: number;
      top_expenses: { description: string; amount: number }[];
    };
    most_received: {
      date: string;
      total: number;
      transaction_count: number;
      top_credits: { description: string; amount: number }[];
    };
    most_transactions: {
      date: string;
      total_spent: number;
      total_received: number;
      transaction_count: number;
    };
  };
  top_recipients: {
    name: string;
    bank: string | null;
    total_sent: number;
    count: number;
    last_sent: string;
  }[];
  top_senders: {
    name: string;
    bank: string | null;
    total_received: number;
    count: number;
    last_received: string;
  }[];
  fees_and_charges: {
    total: number;
    items: { type: string; total: number; count: number }[];
  };
  categories: Record<string, Category>;
  unidentified: {
    date: string;
    description: string;
    amount: number;
    type: "debit" | "credit";
    reference: string;
  }[];
};

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function slug(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AnalyzePage() {
  const router = useRouter();
  const [data, setData] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("analysisResult");
    if (!raw) {
      router.replace("/upload");
      return;
    }
    const parsed = JSON.parse(raw);
    setData(parsed.message ?? parsed);
  }, [router]);

  if (!data) return null;

  const { summary, spending_days, top_recipients, top_senders, fees_and_charges, categories, unidentified } = data;
  const categoryEntries = Object.entries(categories ?? {});
  const isPositive = summary.net_cash_flow >= 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/8 via-background to-accent/20 border-b border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/upload" className="hover:text-foreground transition-colors">Upload</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/review" className="hover:text-foreground transition-colors">Review</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Analysis</span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Statement Analysis</h1>
              <p className="text-muted-foreground">
                {summary.period_start} — {summary.period_end}
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 self-start mt-1">
              {summary.transaction_count} transactions
            </Badge>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 w-full space-y-10">

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Income",
              value: fmt(summary.total_income),
              icon: TrendingUp,
              color: "text-green-600",
              bg: "bg-green-50 dark:bg-green-950/30",
              ring: "ring-green-200 dark:ring-green-900",
            },
            {
              label: "Total Expenses",
              value: fmt(summary.total_expenses),
              icon: TrendingDown,
              color: "text-red-500",
              bg: "bg-red-50 dark:bg-red-950/30",
              ring: "ring-red-200 dark:ring-red-900",
            },
            {
              label: "Net Cash Flow",
              value: fmt(summary.net_cash_flow),
              icon: ArrowLeftRight,
              color: isPositive ? "text-green-600" : "text-red-500",
              bg: isPositive ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30",
              ring: isPositive ? "ring-green-200 dark:ring-green-900" : "ring-red-200 dark:ring-red-900",
            },
            {
              label: "Transactions",
              value: String(summary.transaction_count),
              icon: Hash,
              color: "text-primary",
              bg: "bg-primary/5",
              ring: "ring-primary/20",
            },
          ].map(({ label, value, icon: Icon, color, bg, ring }) => (
            <Card key={label} className={`border-border/60 rounded-2xl ring-1 ${ring}`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className={`text-lg font-bold truncate ${color}`}>{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Key days ── */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Key Days
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Most spent */}
            <Card className="border-border/60 rounded-2xl">
              <CardHeader className="px-5 pt-5 pb-3">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Highest Spend</p>
                <p className="text-xl font-bold text-foreground">{spending_days.most_spent.date}</p>
                <p className="text-sm text-muted-foreground">
                  ₦{fmt(spending_days.most_spent.total)} · {spending_days.most_spent.transaction_count} txns
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                {spending_days.most_spent.top_expenses?.map((e, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate max-w-[60%]">{e.description}</span>
                    <span className="text-red-500 font-medium">₦{fmt(e.amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Most received */}
            <Card className="border-border/60 rounded-2xl">
              <CardHeader className="px-5 pt-5 pb-3">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Highest Income</p>
                <p className="text-xl font-bold text-foreground">{spending_days.most_received.date}</p>
                <p className="text-sm text-muted-foreground">
                  ₦{fmt(spending_days.most_received.total)} · {spending_days.most_received.transaction_count} txns
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                {spending_days.most_received.top_credits?.map((e, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate max-w-[60%]">{e.description}</span>
                    <span className="text-green-600 font-medium">₦{fmt(e.amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Most transactions */}
            <Card className="border-border/60 rounded-2xl">
              <CardHeader className="px-5 pt-5 pb-3">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Busiest Day</p>
                <p className="text-xl font-bold text-foreground">{spending_days.most_transactions.date}</p>
                <p className="text-sm text-muted-foreground">
                  {spending_days.most_transactions.transaction_count} transactions
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="text-red-500 font-medium">₦{fmt(spending_days.most_transactions.total_spent)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Received</span>
                  <span className="text-green-600 font-medium">₦{fmt(spending_days.most_transactions.total_received)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Spending categories ── */}
        {categoryEntries.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" /> Spending Categories
            </h2>
            <Accordion>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryEntries
                  .sort(([, a], [, b]) => b.total_spent - a.total_spent)
                  .map(([name, cat]) => (
                    <Card key={name} className="border-border/60 rounded-2xl overflow-hidden">
                      <AccordionItem value={name}>
                        <AccordionTrigger className="px-5 py-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-3">
                            <div className="text-left">
                              <p className="text-sm font-semibold text-foreground">{slug(name)}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{cat.count} transactions</p>
                            </div>
                            <span className="text-sm font-bold text-red-500">₦{fmt(cat.total_spent)}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5">
                          <div className="border-t border-border/40 pt-3 space-y-2">
                            {cat.transactions.map((tx, i) => (
                              <div key={i} className="flex items-start justify-between gap-3 text-xs">
                                <div className="min-w-0">
                                  <p className="text-foreground truncate">{tx.description}</p>
                                  <p className="text-muted-foreground">{tx.date}</p>
                                </div>
                                <span className="text-red-500 font-medium whitespace-nowrap">₦{fmt(tx.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  ))}
              </div>
            </Accordion>
          </div>
        )}

        {/* ── People: Recipients & Senders ── */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> People
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top recipients */}
            <Card className="border-border/60 rounded-2xl overflow-hidden">
              <CardHeader className="bg-red-50/50 dark:bg-red-950/20 border-b border-border/50 px-5 py-4">
                <p className="text-sm font-semibold text-foreground">Top Recipients</p>
                <p className="text-xs text-muted-foreground">Who you sent the most money to</p>
              </CardHeader>
              <CardContent className="p-0">
                {top_recipients?.length ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground">Name</th>
                        <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground">Total Sent</th>
                        <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground">Times</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top_recipients.map((r, i) => (
                        <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-foreground">{r.name}</p>
                            {r.bank && <p className="text-xs text-muted-foreground">{r.bank}</p>}
                          </td>
                          <td className="px-5 py-3 text-right text-red-500 font-semibold">₦{fmt(r.total_sent)}</td>
                          <td className="px-5 py-3 text-right text-muted-foreground">{r.count}×</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="px-5 py-4 text-sm text-muted-foreground">No recipients found.</p>
                )}
              </CardContent>
            </Card>

            {/* Top senders */}
            <Card className="border-border/60 rounded-2xl overflow-hidden">
              <CardHeader className="bg-green-50/50 dark:bg-green-950/20 border-b border-border/50 px-5 py-4">
                <p className="text-sm font-semibold text-foreground">Top Senders</p>
                <p className="text-xs text-muted-foreground">Who sent the most money to you</p>
              </CardHeader>
              <CardContent className="p-0">
                {top_senders?.length ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground">Name</th>
                        <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground">Total Received</th>
                        <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground">Times</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top_senders.map((s, i) => (
                        <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-foreground">{s.name}</p>
                            {s.bank && <p className="text-xs text-muted-foreground">{s.bank}</p>}
                          </td>
                          <td className="px-5 py-3 text-right text-green-600 font-semibold">₦{fmt(s.total_received)}</td>
                          <td className="px-5 py-3 text-right text-muted-foreground">{s.count}×</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="px-5 py-4 text-sm text-muted-foreground">No senders found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Fees & charges ── */}
        {fees_and_charges?.items?.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" /> Fees & Charges
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                Total: <span className="text-red-500 font-semibold">₦{fmt(fees_and_charges.total)}</span>
              </span>
            </h2>
            <Card className="border-border/60 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/60">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees_and_charges.items
                      .sort((a, b) => b.total - a.total)
                      .map((item, i) => (
                        <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-foreground">{item.type}</td>
                          <td className="px-5 py-3 text-right text-red-500 font-semibold">₦{fmt(item.total)}</td>
                          <td className="px-5 py-3 text-right text-muted-foreground">{item.count}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Unidentified ── */}
        {unidentified?.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              Unidentified Transactions
              <Badge variant="secondary" className="ml-1 text-amber-600 bg-amber-50 border-amber-200">
                {unidentified.length}
              </Badge>
            </h2>
            <Card className="border-border/60 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border/60">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                        <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unidentified.map((tx, i) => (
                        <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{tx.date}</td>
                          <td className="px-5 py-3 text-foreground max-w-xs">{tx.description}</td>
                          <td className={`px-5 py-3 text-right font-semibold whitespace-nowrap ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                            ₦{fmt(tx.amount)}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <Badge
                              variant="secondary"
                              className={tx.type === "credit" ? "text-green-600 bg-green-50 border-green-200" : "text-red-500 bg-red-50 border-red-200"}
                            >
                              {tx.type}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-8 mt-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <BarChart2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">
                Spend<span className="text-primary">Lens</span>
              </span>
            </div>
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
            </div>
            <p className="text-sm text-muted-foreground">&copy; 2026 SpendLens.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
