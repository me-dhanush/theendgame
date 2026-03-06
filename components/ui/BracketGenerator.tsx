"use client";

import { useState } from "react";
import { Entrant, RoundSlot, generateKnockoutBracket } from "@/lib/pairing";
import { createTournament } from "@/lib/actions/createTournament";

interface Props {
  onGenerate: (rounds: RoundSlot[]) => void;
}

function nextPowerOfTwo(n: number) {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

export default function BracketGenerator({ onGenerate }: Props) {
  const defaultPlayers: Entrant[] = [
    { name: "magnus", rating: 2830 },
    { name: "hikaru", rating: 2785 },
    { name: "ding", rating: 2755 },
    { name: "ian", rating: 2730 },
  ];

  const [players, setPlayers] = useState<Entrant[]>(defaultPlayers);
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [tournamentName, setTournamentName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  const isPowerOfTwo =
    players.length > 0 && Number.isInteger(Math.log2(players.length));

  const nextBracketSize =
    players.length > 0 ? nextPowerOfTwo(players.length) : 2;

  function addPlayer() {
    if (!name.trim() || !rating) return;

    setPlayers((prev) => [
      ...prev,
      { name: name.trim(), rating: Number(rating) },
    ]);

    setName("");
    setRating("");
  }

  function removePlayer(index: number) {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGenerate() {
    try {
      if (!tournamentName.trim()) {
        throw new Error("Tournament name is required");
      }

      setLoading(true);

      await createTournament({
        name: tournamentName,
        players,
      });

      const rounds = generateKnockoutBracket(players);

      setError(null);
      onGenerate(rounds);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto p-7">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">
        Create Tournament
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="space-y-5">
          {/* Tournament Name */}
          <div>
            <label className="text-sm text-zinc-500 mb-1 block">
              Tournament Name
            </label>

            <input
              type="text"
              placeholder="World Blitz Arena"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>

          {/* Add Player */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Lichess username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
            />

            <input
              type="number"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              className="w-28 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
            />

            <button
              onClick={addPlayer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-[0.98] transition"
            >
              Add
            </button>
          </div>

          {/* Player List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sortedPlayers.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
              >
                <span className="text-sm font-medium">
                  {p.name}
                  <span className="text-zinc-500 ml-1">({p.rating})</span>
                </span>

                <button
                  onClick={() => removePlayer(i)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Player Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-zinc-500 mb-1">
                <span>Players</span>
                <span>
                  {players.length} / {nextBracketSize}
                </span>
              </div>

              <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${(players.length / nextBracketSize) * 100}%`,
                  }}
                />
              </div>

              {!isPowerOfTwo && players.length > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Knockout tournaments require 2, 4, 8, 16 players
                </p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            disabled={!isPowerOfTwo || loading}
            onClick={handleGenerate}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating Tournament..." : "Generate Round 1 Pairing"}
          </button>
        </div>
      </div>
    </div>
  );
}
