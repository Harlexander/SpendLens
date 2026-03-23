"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { BarChart2, ChevronRight, ArrowRight } from "lucide-react";

type Transaction = {
  date: string;
  description: string;
  debit: string | null;
  credit: string | null;
  balance: string | null;
};

type StatementData = {
  account_name: string;
  account_number: string;
  period: string;
  opening_balance: string;
  closing_balance: string;
  transactions: Transaction[];
};

export default function ReviewPage() {
  const router = useRouter();
  const [data, setData] = useState<StatementData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("statementData");
    if (!raw) {
      router.replace("/upload");
      return;
    }
    setData(JSON.parse(raw));
  }, [router]);

  const analyzeStatement = async () => {
    if (!data) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: data.transactions }),
      });
      const result = await res.json();
      console.log(result)
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      router.push("/analyze");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!data) return null;

  const columns: { key: keyof Transaction; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "description", label: "Description" },
    { key: "debit", label: "Debit" },
    { key: "credit", label: "Credit" },
    { key: "balance", label: "Balance" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Page header */}
      <section className="bg-gradient-to-br from-primary/8 via-background to-accent/20 border-b border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/upload" className="hover:text-foreground transition-colors">Upload Statement</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Review</span>
          </div>
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Step 2 of 2</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-3">Review Extracted Data</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Confirm the transactions look correct before we run the full analysis.
          </p>
        </div>
      </section>

      {/* Account summary */}
      <section className="bg-background border-b border-border/50 py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Account Name", value: data.account_name },
              { label: "Account Number", value: data.account_number },
              { label: "Period", value: data.period },
              { label: "Opening Balance", value: data.opening_balance },
              { label: "Closing Balance", value: data.closing_balance },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-border/60 rounded-xl px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-semibold text-foreground truncate">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transactions table */}
      <section className="flex-1 py-10 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{data.transactions.length}</span> transactions found
            </p>
          </div>

          <div className="rounded-xl border border-border/60 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border/60">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((tx, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-foreground">{tx.date || "—"}</td>
                    <td className="px-4 py-3 max-w-xs text-foreground">{tx.description || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-red-500 font-medium">
                      {tx.debit ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-green-600 font-medium">
                      {tx.credit ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-foreground font-medium">
                      {tx.balance ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Upload
            </Button>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2 disabled:opacity-50"
              disabled={isAnalyzing}
              onClick={analyzeStatement}
            >
              {isAnalyzing ? "Analyzing…" : "Analyze Statement"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-8">
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
