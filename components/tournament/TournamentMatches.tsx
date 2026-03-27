import { useState } from "react";
import MatchCard from "./MatchCard";

export default function TournamentMatches({ rounds }: any) {
  const [selectedRound, setSelectedRound] = useState(0);

  return (
    <div className="border-b bg-muted/30 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-8">

        {/* ROUND SELECTOR */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {rounds.map((round: any, index: number) => {
            const active = selectedRound === index;

            return (
              <button
                key={round.id}
                onClick={() => setSelectedRound(index)}
                className={`
                  shrink-0 px-4 py-2 text-sm rounded-lg transition-all duration-200
                  border
                  ${
                    active
                      ? "bg-background border-foreground/20 text-foreground shadow-sm"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/60"
                  }
                `}
              >
                Round {round.roundNumber}
              </button>
            );
          })}
        </div>

        {/* MATCH GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {rounds[selectedRound]?.matches?.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-10">
              <p className="text-sm text-muted-foreground">
                No matches in this round yet.
              </p>
            </div>
          )}

          {rounds[selectedRound]?.matches?.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}