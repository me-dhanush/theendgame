"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const tournamentId = tournament.id;
  const currentRoundNumber = tournament.currentRoundNumber
  const rounds = tournament.rounds;
  const players = tournament.members;
  const totalRounds = rounds.length;

  const canStartNextRound = currentRoundNumber < totalRounds;

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh(); // refetches server data
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground pt-10">
      <TournamentHeader
        tournament={tournament}
        players={players}
        rounds={rounds}
      />

      <TournamentTabs
        tab={tab}
        setTab={setTab}
        tournamentId={tournamentId}
        canStartNextRound={canStartNextRound}
      />

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