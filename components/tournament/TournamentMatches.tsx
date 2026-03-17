import { useState } from "react";
import MatchCard from "./MatchCard";

export default function TournamentMatches({ rounds }: any) {
  const [selectedRound, setSelectedRound] = useState(0);

  return (
    <div className="space-y-6">
      {/* ROUND SELECTOR */}
      <div className="flex gap-4 border-b border-border pb-2">
        {rounds.map((round: any, index: number) => (
          <button
            key={round.id}
            onClick={() => setSelectedRound(index)}
            className={`px-4 py-2 rounded-md text-sm transition ${
              selectedRound === index
                ? "bg-muted font-semibold"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            Round {round.roundNumber}
          </button>
        ))}
      </div>

      {/* MATCH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rounds[selectedRound]?.matches?.length === 0 && (
          <p className="opacity-60">No matches in this round yet.</p>
        )}

        {rounds[selectedRound]?.matches?.map((match: any) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
