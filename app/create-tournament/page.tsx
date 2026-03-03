"use client";

import { useState } from "react";
import SVGBracket from "@/components/ui/SVGBracket";
import BracketGenerator from "@/components/ui/BracketGenerator";
import { RoundType } from "@/lib/pairing";

export default function Page() {
  const [rounds, setRounds] = useState<RoundType[] | null>(null);

  return (
    <div className="p-10 space-y-10">
      <BracketGenerator onGenerate={setRounds} />

      {rounds && <SVGBracket rounds={rounds} />}
    </div>
  );
}
