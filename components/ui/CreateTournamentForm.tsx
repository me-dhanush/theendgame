"use client";

import { useState } from "react";
import { createTournament } from "@/lib/actions/createTournament";

interface Player {
  name: string;
  rating: number;
}

interface Props {
  onGenerate: (tournamentId: string) => void;
}

function nextPowerOfTwo(n: number) {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

export default function CreateTournamentForm({ onGenerate }: Props) {
  const [tournamentName, setTournamentName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  const isPowerOfTwo =
    players.length > 0 && Number.isInteger(Math.log2(players.length));

  const nextBracketSize =
    players.length > 0 ? nextPowerOfTwo(players.length) : 2;

function addPlayer() {
  if (!username.trim() || !rating) return;

  setPlayers((prev) => [
    ...prev,
    { name: username.trim(), rating: Number(rating) },
  ]);

  setUsername("");
  setRating("");
}

  function removePlayer(index: number) {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreate() {
    try {
      if (!tournamentName.trim()) {
        throw new Error("Tournament name required");
      }

      if (!isPowerOfTwo) {
        throw new Error("Players must be 2,4,8,16...");
      }

      setLoading(true);

      const tournament = await createTournament({
        name: tournamentName,
        players,
      });

      onGenerate(tournament.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

return (
  <div className="w-full min-h-screen px-12 py-12">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-10">Create Tournament</h1>

      <div className="space-y-10">
        {/* Tournament Name */}
        <div className="grid grid-cols-3 items-center gap-8">
          <div>
            <h3 className="font-medium">Tournament Name</h3>
            <p className="text-sm text-zinc-500">
              Give your tournament a clear name
            </p>
          </div>

          <div className="col-span-2">
            <input
              type="text"
              placeholder="World Blitz Arena"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="w-full px-4 py-3 rounded-md
  border border-zinc-300 dark:border-zinc-700
  bg-zinc-50 dark:bg-zinc-900
  focus:outline-none focus:border-blue-500
  transition-colors"
            />
          </div>
        </div>

        {/* Add Player */}
        <div className="grid grid-cols-3 items-center gap-8">
          <div>
            <h3 className="font-medium">Add Player</h3>
            <p className="text-sm text-zinc-500">Enter username and rating</p>
          </div>

          <div className="col-span-2 flex gap-3">
            <input
              type="text"
              placeholder="Lichess username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-4 py-3 rounded-md
  border border-zinc-300 dark:border-zinc-700
  bg-zinc-50 dark:bg-zinc-900
  focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-32 px-4 py-3 rounded-md
  border border-zinc-300 dark:border-zinc-700
  bg-zinc-50 dark:bg-zinc-900
  focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={addPlayer}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Player List */}
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium">Players</h3>
            <p className="text-sm text-zinc-500">
              Players will be seeded by rating
            </p>
          </div>

          <div className="col-span-2 space-y-2 max-h-72 overflow-y-auto border rounded-lg p-4">
            {sortedPlayers.length === 0 && (
              <div className="text-sm text-zinc-500">No players added yet</div>
            )}
            {sortedPlayers.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
              >
                <span>
                  {p.name}
                  <span className="text-zinc-500 ml-2">({p.rating})</span>
                </span>

                <button
                  onClick={() => removePlayer(i)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Player Progress */}
        <div className="grid grid-cols-3 gap-8 items-center">
          <div>
            <h3 className="font-medium">Bracket Size</h3>
            <p className="text-sm text-zinc-500">
              Knockout requires powers of 2
            </p>
          </div>

          <div className="col-span-2">
            <div className="flex justify-between text-sm mb-2 text-zinc-500">
              <span>Players</span>
              <span>
                {players.length} / {nextBracketSize}
              </span>
            </div>

            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden dark:bg-zinc-800">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{
                  width: `${(players.length / nextBracketSize) * 100}%`,
                }}
              />
            </div>

            {!isPowerOfTwo && players.length > 0 && (
              <p className="text-xs text-red-500 mt-2">
                Must be 2, 4, 8, 16 players
              </p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* Submit */}
        <div className="pt-6 border-t">
          <button
            disabled={!isPowerOfTwo || loading}
            onClick={handleCreate}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-40"
          >
            {loading ? "Creating Tournament..." : "Create Tournament"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}