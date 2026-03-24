"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import {
  Upload,
  FileText,
  Shield,
  Zap,
  PieChart,
  TrendingUp,
  Brain,
  Check,
  ChevronRight,
  X,
  BarChart2,
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }

  const extractData = async () => {
    setIsLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("file", selectedFile!);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      sessionStorage.setItem("statementData", JSON.stringify(data.response));
      router.push("/review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Page header */}
      <section className="bg-gradient-to-br from-primary/8 via-background to-accent/20 border-b border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors" >Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Upload Statement</span>
          </div>
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Step 1 of 2</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-3">Upload Your Bank Statement</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            We&apos;ll analyze your transactions, categorize your spending, and surface personalized
            insights — all in under 30 seconds.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="flex-1 py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — upload area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/8 scale-[1.01]"
                  : selectedFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/70 bg-muted/30 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.csv,.xlsx,.xls,.ofx,.qfx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="flex flex-col items-center justify-center py-16 px-8 text-center pointer-events-none">
                {selectedFile ? (
                  <>
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 ring-4 ring-primary/10">
                      <FileText className="h-7 w-7 text-primary" />
                    </div>
                    <p className="text-base font-semibold text-foreground mb-1">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground mb-5">Ready to analyze</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-600 font-medium">File loaded successfully</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-5 transition-all ${isDragging ? "bg-primary scale-110" : "bg-primary/10"}`}>
                      <Upload className={`h-7 w-7 transition-colors ${isDragging ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <p className="text-xl font-semibold text-foreground mb-2">
                      {isDragging ? "Drop your file here" : "Drag & drop your statement"}
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">
                      or click anywhere in this area to browse
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["PDF", "CSV", "XLSX", "OFX", "QFX"].map((fmt) => (
                        <Badge key={fmt} variant="secondary" className="text-xs font-mono text-primary">
                          .{fmt.toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selected file row */}
            {selectedFile && (
              <div className="flex items-center justify-between bg-card border border-border/60 rounded-xl px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">PDF &bull; Ready to analyze</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="h-7 w-7 rounded-full bg-muted hover:bg-destructive/10 flex items-center justify-center transition-colors group"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground group-hover:text-destructive" />
                </button>
              </div>
            )}

            {/* Statement type */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Statement type</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Checking", icon: "🏦" },
                  { label: "Savings", icon: "💰" },
                  { label: "Credit Card", icon: "💳" },
                  { label: "Business", icon: "🏢" },
                ].map((type, i) => (
                  <button
                    key={type.label}
                    className={`flex flex-col items-center gap-2 rounded-xl border py-4 px-3 text-sm font-medium transition-all ${
                      i === 0
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank selector */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Select your bank <span className="text-muted-foreground font-normal">(optional — helps accuracy)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {["Auto-detect", "Chase", "Bank of America", "Wells Fargo", "Citibank", "TD Bank", "Capital One", "Other"].map((bank, i) => (
                  <button
                    key={bank}
                    className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                      i === 0
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Privacy notice */}
            <div className="flex items-start gap-3 bg-muted/40 rounded-xl px-5 py-4">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Your data is safe.</span> We process your
                statement in memory only. Files are never stored, shared, or used for training. All
                transfers are encrypted end-to-end.
              </p>
            </div>

            {/* Submit */}
            <Button
              size="lg"
              onClick={extractData}
              disabled={!selectedFile || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2 disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              {isLoading
                ? "Extracting transactions…"
                : selectedFile
                ? "Analyze My Statement"
                : "Upload a statement to continue"}
            </Button>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* What you'll get */}
            <Card className="bg-card border-border/60 rounded-2xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border/50 px-6 py-5">
                <h3 className="text-base font-semibold text-foreground">What you&apos;ll get</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Your personalized financial report includes:</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { icon: PieChart, label: "Spending breakdown by category", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: TrendingUp, label: "Month-over-month spending trends", color: "text-indigo-500", bg: "bg-indigo-50" },
                  { icon: Brain, label: "AI-generated savings recommendations", color: "text-violet-500", bg: "bg-violet-50" },
                  { icon: BarChart2, label: "Subscription & recurring charge audit", color: "text-sky-500", bg: "bg-sky-50" },
                  { icon: FileText, label: "Downloadable PDF summary report", color: "text-blue-600", bg: "bg-blue-50" },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sample insight */}
            <Card className="bg-card border-border/60 rounded-2xl overflow-hidden">
              <CardHeader className="px-6 pt-5 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Sample insight</h3>
                  <Badge variant="secondary" className="text-xs text-primary">Preview</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/20 border border-border/50 p-4">
                  <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">AI Insight</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    You&apos;re spending <strong>34% more on dining</strong> than similar profiles.
                    Cooking at home just 3 extra days/week could save you <strong>~$280/month</strong>.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: "Food & Dining", pct: 34, amount: "$842" },
                    { label: "Entertainment", pct: 18, amount: "$445" },
                    { label: "Transport", pct: 14, amount: "$346" },
                  ].map((cat) => (
                    <div key={cat.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground">{cat.label}</span>
                        <span className="text-muted-foreground">{cat.amount}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${cat.pct * 2.5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust */}
            <Card className="bg-card border-border/60 rounded-2xl p-6">
              <p className="text-sm font-semibold text-foreground mb-4">Trusted by 12,000+ users</p>
              <div className="space-y-3">
                {[
                  "No account required",
                  "Bank-grade encryption",
                  "Data never stored",
                  "Free to get started",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </Card>
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
