"use client";

import React, { useState } from "react";
import BracketSVG, { RoundWithMatches } from "../ui/BracketSVG";

interface Props {
  rounds: RoundWithMatches[];
}

export default function TournamentBracket({ rounds }: Props) {
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null);

  return (
    <section id="bracket">
      <div className="w-full">
        {/* <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tournament Bracket View
          </h1>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-2">
            Knockout Stage Overview
          </p>
        </div> */}

        <BracketSVG
          rounds={rounds}
          hoveredMatch={hoveredMatch}
          setHoveredMatch={setHoveredMatch}
          layout={{
            nodeWidth: 200,
            nodeHeight: 90,
            horizontalGap: 260,
            paddingX: 60,
            paddingY: 60,
          }}
        />
      </div>
    </section>
  );
}
