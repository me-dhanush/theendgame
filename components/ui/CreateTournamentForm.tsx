"use client";

import { useState } from "react";
import { createTournament } from "@/lib/actions/createTournament";
import { useRouter } from "next/navigation";

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
const users = [
  { name: "magnuscarlsen", rating: 2830 },
  { name: "hikaru", rating: 2780 },
  { name: "firouzja", rating: 2760 },
  { name: "dingliren", rating: 2750 },
  { name: "nepomniachtchi", rating: 2740 },
  { name: "gukesh", rating: 2730 },
  { name: "praggnanandhaa", rating: 2720 },
  { name: "vidit", rating: 2710 },
  { name: "anishgiri", rating: 2700 },
  { name: "wesleyso", rating: 2690 },
  { name: "levonaronian", rating: 2680 },
  { name: "fabianocaruana", rating: 2670 },
  { name: "teimourradjabov", rating: 2660 },
  { name: "sergeykarjakin", rating: 2650 },
  { name: "richardrapport", rating: 2640 },
  { name: "duda", rating: 2630 },

  { name: "player17", rating: 2400 },
  { name: "player18", rating: 2390 },
  { name: "player19", rating: 2380 },
  { name: "player20", rating: 2370 },
  { name: "player21", rating: 2360 },
  { name: "player22", rating: 2350 },
  { name: "player23", rating: 2340 },
  { name: "player24", rating: 2330 },
  { name: "player25", rating: 2320 },
  { name: "player26", rating: 2310 },
  { name: "player27", rating: 2300 },
  { name: "player28", rating: 2290 },
  { name: "player29", rating: 2280 },
  { name: "player30", rating: 2270 },
  { name: "player31", rating: 2260 },
  { name: "player32", rating: 2250 },
];
  const [tournamentName, setTournamentName] = useState("");
  const [players, setPlayers] = useState<Player[]>(users);
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
const router = useRouter();
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
  bg-white dark:bg-zinc-900
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
  bg-white dark:bg-zinc-900
  focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-32 px-4 py-3 rounded-md
  border border-zinc-300 dark:border-zinc-700
  bg-white dark:bg-zinc-900
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

        <div className="pt-8 border-t flex items-center justify-between">
          {/* Left side navigation */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 border border-zinc-300 rounded-md hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Go Back
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-5 py-2 border border-zinc-300 rounded-md hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Home
            </button>
          </div>

          {/* Right side submit */}
          <button
            disabled={!isPowerOfTwo || loading}
            onClick={handleCreate}
            className="px-8 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:opacity-40"
          >
            {loading ? "Creating..." : "Create Tournament"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}