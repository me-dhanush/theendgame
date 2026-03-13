"use client";

import { useState } from "react";
import TournamentBracket from "@/components/sections/tournament-bracket";

type Props = {
  tournament: any;
};

export default function TournamentClient({ tournament }: Props) {
  const [tab, setTab] = useState("overview");
  const [selectedRound, setSelectedRound] = useState(0);

  const rounds = tournament.rounds;
  const players = tournament.members;

  const totalMatches = rounds.reduce(
    (acc: number, r: any) => acc + r.matches.length,
    0,
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground pt-10">
      {/* HEADER */}
      <div className="border-b border-border bg-muted/30 px-12 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {tournament.name}
          </h1>

          <p className="opacity-70 mt-2">
            Hosted by{" "}
            <span className="font-semibold">{tournament.host.username}</span>
          </p>
        </div>

        <div className="flex gap-10 text-sm">
          <div className="bg-muted/40 px-4 py-2 rounded-lg">
            <p className="opacity-60 text-xs">Players</p>
            <p className="text-xl font-semibold">{players.length}</p>
          </div>

          <div className="bg-muted/40 px-4 py-2 rounded-lg">
            <p className="opacity-60 text-xs">Rounds</p>
            <p className="text-xl font-semibold">{rounds.length}</p>
          </div>

          <div className="bg-muted/40 px-4 py-2 rounded-lg">
            <p className="opacity-60 text-xs">Matches</p>
            <p className="text-xl font-semibold">{totalMatches}</p>
          </div>
        </div>
      </div>

      {/* MAIN TABS */}
      <div className="border-b border-border bg-muted/20 px-12 flex gap-6 text-sm">
        {["overview", "bracket", "players", "matches"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-4 capitalize border-b-2 transition ${
              tab === t
                ? "border-primary font-semibold"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-12">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1 border border-border bg-muted/20 rounded-xl p-6">
              <h2 className="font-semibold mb-4">Top Players</h2>

              <div className="space-y-3">
                {players
                  .sort((a: any, b: any) => b.rating - a.rating)
                  .slice(0, 8)
                  .map((p: any) => (
                    <div
                      key={p.id}
                      className="flex justify-between bg-muted/40 px-3 py-2 rounded-md"
                    >
                      <span>{p.user.username}</span>
                      <span className="opacity-70 text-sm">{p.rating}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="col-span-2 border border-border bg-muted/20 rounded-xl p-6">
              <h2 className="font-semibold mb-6">Bracket Preview</h2>

              <div className="overflow-auto bg-background rounded-lg p-4">
                <TournamentBracket rounds={rounds} />
              </div>
            </div>
          </div>
        )}

        {/* BRACKET */}
        {tab === "bracket" && (
          <div className="bg-muted/20 border border-border rounded-xl p-8">
            <div className="min-w-[1100px]">
              <TournamentBracket rounds={rounds} />
            </div>
          </div>
        )}

        {/* PLAYERS */}
        {tab === "players" && (
          <div className="max-w-[700px] space-y-3">
            {players
              .sort((a: any, b: any) => b.rating - a.rating)
              .map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border border-border bg-muted/20 px-4 py-3 rounded-lg hover:bg-muted/40 transition"
                >
                  <div className="font-medium">{p.user.username}</div>

                  <div className="text-sm opacity-70">Rating {p.rating}</div>
                </div>
              ))}
          </div>
        )}

        {/* MATCHES */}
        {tab === "matches" && (
          <div className="space-y-6">
            {/* ROUND TABS */}
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

            {/* ROUND MATCHES */}
            <div className="border border-border bg-muted/20 rounded-xl overflow-hidden">
              {rounds[selectedRound]?.matches.map((match: any) => (
                <div
                  key={match.id}
                  className="flex justify-between items-center px-6 py-3 border-b border-border last:border-none hover:bg-muted/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <span>{match.player1?.user?.username ?? "TBD"}</span>

                    <span className="opacity-60">vs</span>

                    <span>{match.player2?.user?.username ?? "TBD"}</span>
                  </div>

                  {match.link && (
                    <a
                      href={match.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline opacity-80 hover:opacity-100 transition"
                    >
                      match
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
