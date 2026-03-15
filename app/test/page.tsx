"use client";

import { useEffect, useState } from "react";
import { readNdjsonStream } from "@/lib/readNdjsonStream";

type Game = any; // keep raw API type

export default function Page() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    async function loadGames() {
      const res = await fetch("/api/bulk-games?bulkId=2UGcKNVg");

      await readNdjsonStream<Game>(res, (game) => {
        setGames((prev) => [...prev, game]);
      });
    }

    loadGames();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Bulk Pairing Games</h1>

      {games.map((g) => {
        const white = g.players?.white?.user?.name;
        const black = g.players?.black?.user?.name;

        const whiteRating = g.players?.white?.rating;
        const blackRating = g.players?.black?.rating;

        const winner =
          g.winner === "white"
            ? white
            : g.winner === "black"
              ? black
              : "Draw / Ongoing";

        const timeControl = g.clock
          ? `${g.clock.initial / 60}+${g.clock.increment}`
          : "Unknown";

        return (
          <div
            key={g.id}
            style={{
              border: "1px solid #ccc",
              padding: 20,
              marginBottom: 20,
              borderRadius: 8,
            }}
          >
            <h3>
              {white} ({whiteRating}) vs {black} ({blackRating})
            </h3>

            <p>Status: {g.status}</p>

            <p>Winner: {winner}</p>

            <p>Time Control: {timeControl}</p>

            <a href={`https://lichess.org/${g.id}`} target="_blank">
              View Game
            </a>
          </div>
        );
      })}
    </div>
  );
}
