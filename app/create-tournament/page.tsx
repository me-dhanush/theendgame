"use client";

import { useState } from "react";
import BracketGenerator from "@/components/ui/BracketGenerator";
import { RoundType } from "@/lib/pairing";
import TournamentBracket from "@/components/sections/tournament-bracket";

export default function Page() {
  const [rounds, setRounds] = useState<RoundType[] | null>(null);

  return (
    <div className="p-10 space-y-10">
      <BracketGenerator onGenerate={setRounds} />

      {rounds && <TournamentBracket rounds={rounds} />}
    </div>
  );
}
