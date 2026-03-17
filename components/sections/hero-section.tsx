"use client";

import Link from "next/link";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full bg-background overflow-hidden"
    >
      {/* Background grid */}
      <InteractiveGridPattern
        className="absolute inset-0 opacity-30"
        width={60}
        height={60}
        squares={[100, 100]}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Main Label */}
        <div className="mb-4 sm:mb-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">
          Single Elimination Tournament
        </div>

        {/* Big Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-primary leading-tight">
          KNOCKOUT.
        </h1>

        {/* Sub Headline */}
        <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-muted-foreground">
          Lose once. You’re eliminated.
        </h2>

        {/* Description */}
        <p className="mt-4 sm:mt-6 max-w-xl md:max-w-2xl text-base sm:text-lg text-muted-foreground">
          Advance through a live bracket where every match is do-or-die. No
          second chances. No lower bracket. Only one player survives.
        </p>

        {/* CTA */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          <Link
            href="/dashboard/create-tournament"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-white text-base sm:text-lg font-semibold rounded-md hover:opacity-90 transition text-center"
          >
            Create Tournament
          </Link>

          <Link
            href="/dashboard"
            className="px-6 sm:px-8 py-3 sm:py-4 border border-border text-base sm:text-lg font-semibold rounded-md hover:bg-accent transition text-center"
          >
            View all tournaments
          </Link>
        </div>
      </div>
    </section>
  );
}
