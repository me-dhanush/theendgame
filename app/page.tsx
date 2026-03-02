'use client';

import { HeroSection } from "@/components/sections/hero-section";
import SVGBracket from "@/components/ui/SVGBracket";
import { testRounds } from "@/lib/pairing";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center divide-y divide-border min-h-screen w-full">
      <HeroSection />
      <SVGBracket rounds={testRounds} />
    </main>
  );
}
