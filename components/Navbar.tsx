import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";
import { ScanLine } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm group-hover:opacity-90 transition-opacity">
            <ScanLine className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Spend<span className="text-primary">Lens</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-opacity"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
