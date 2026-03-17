"use client";

import { useState, useMemo } from "react";
import TournamentBracket from "@/components/sections/tournament-bracket";

import TournamentHeader from "@/components/tournament/TournamentHeader";
import TournamentTabs from "@/components/tournament/TournamentTabs";
import TournamentPlayers from "@/components/tournament/TournamentPlayers";
import TournamentMatches from "@/components/tournament/TournamentMatches";

type Props = {
  tournament: any;
};

export default function TournamentClient({ tournament }: Props) {
  // swapped default tab
  const [tab, setTab] = useState<"players" | "matches" | "bracket">("matches");

  const rounds = tournament.rounds;
  const players = tournament.members;

  const totalMatches = useMemo(
    () => rounds.reduce((acc: number, r: any) => acc + r.matches.length, 0),
    [rounds],
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground pt-10">
      <TournamentHeader
        tournament={tournament}
        players={players}
        rounds={rounds}
        totalMatches={totalMatches}
      />

      <TournamentTabs tab={tab} setTab={setTab} />

      <div className="flex-1 overflow-auto p-12">

        {/* MATCHES FIRST */}
        {tab === "matches" && <TournamentMatches rounds={rounds} />}

        {/* PLAYERS */}
        {tab === "players" && <TournamentPlayers players={players} />}

        {/* BRACKET LAST */}
        {tab === "bracket" && (
          <div className="bg-muted/20 border border-border rounded-xl p-8">
            <div className="min-w-[1100px]">
              <TournamentBracket rounds={rounds} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}