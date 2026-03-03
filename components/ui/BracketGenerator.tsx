"use client";

import { useState } from "react";
import { PlayerType, RoundType, generateKnockoutBracket } from "@/lib/pairing";

interface Props {
  onGenerate: (rounds: RoundType[]) => void;
}

export default function BracketGenerator({ onGenerate }: Props) {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addPlayer() {
    if (!name || !rating) return;

    setPlayers([...players, { name, rating: Number(rating) }]);

    setName("");
    setRating("");
  }

  function removePlayer(index: number) {
    setPlayers(players.filter((_, i) => i !== index));
  }

  function handleGenerate() {
    try {
      const rounds = generateKnockoutBracket(players);
      setError(null);
      onGenerate(rounds);
    } catch (err: any) {
      setError(err.message);
    }
  }

  const isPowerOfTwo =
    players.length > 0 && Number.isInteger(Math.log2(players.length));

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Tournament</h2>

      {/* Input Section */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Player Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md border dark:bg-zinc-800"
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-28 px-3 py-2 rounded-md border dark:bg-zinc-800"
        />
        <button
          onClick={addPlayer}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Players List */}
      <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
        {players.map((p, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-md"
          >
            <span>
              {p.name} ({p.rating})
            </span>
            <button
              onClick={() => removePlayer(i)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Validation Info */}
      <div className="text-sm mb-4">
        Players: {players.length}{" "}
        {!isPowerOfTwo && players.length > 0 && (
          <span className="text-red-500">(Must be power of 2)</span>
        )}
      </div>

      {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}

      {/* Generate Button */}
      <button
        disabled={!isPowerOfTwo}
        onClick={handleGenerate}
        className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-40"
      >
        Generate Round 1 Pairing
      </button>
    </div>
  );
}
