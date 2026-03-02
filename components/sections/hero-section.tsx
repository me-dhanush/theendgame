"use client";

import Link from "next/link";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Background grid */}
      <InteractiveGridPattern
        className="absolute inset-0 opacity-30"
        width={60}
        height={60}
        squares={[100, 100]}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6">
        {/* Main Label */}
        <div className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">
          ⚔️ Single Elimination Tournament
        </div>

        {/* Big Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-primary leading-tight">
          KNOCKOUT.
        </h1>

        {/* Sub Headline */}
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-muted-foreground">
          Lose once. You’re eliminated.
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Advance through a live bracket where every match is do-or-die. No
          second chances. No lower bracket. Only one player survives.
        </p>

        {/* CTA */}
        <div className="mt-10 flex gap-6">
          <Link
            href="/tournament/join"
            className="px-8 py-4 bg-secondary text-primary-foreground text-lg font-semibold rounded-md hover:opacity-90 transition"
          >
            Enter the Arena
          </Link>

          <Link
            href="/tournament/bracket"
            className="px-8 py-4 border border-border text-lg font-semibold rounded-md hover:bg-accent transition"
          >
            View Live Bracket
          </Link>
        </div>
      </div>
    </section>
  );
}
