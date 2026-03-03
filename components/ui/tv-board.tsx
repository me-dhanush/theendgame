"use client";

import { useEffect, useState } from "react";
import { readNdjsonStream } from "@/lib/readNdjsonStream";
import { Chessboard } from "react-chessboard";
import PlayerCard from "./player-card";

type FenEvent = {
  t: "fen";
  d: {
    fen: string;
    wc: number;
    bc: number;
  };
};

type FeaturedEvent = {
  t: "featured";
  d: {
    fen: string;
    players: {
      color: "white" | "black";
      rating: number;
      seconds: number;
      user: {
        name: string;
        title?: string;
      };
    }[];
  };
};

type LichessFenEvent = FenEvent | FeaturedEvent;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

type TvMode = "bullet" | "blitz" | "rapid";

export default function TvBoard({ mode }: { mode: TvMode }) {
  const [position, setPosition] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
const [whitePlayer, setWhitePlayer] = useState("");
const [blackPlayer, setBlackPlayer] = useState("");
const [whiteRating, setWhiteRating] = useState<number | null>(null);
const [blackRating, setBlackRating] = useState<number | null>(null);
const [whiteTitle, setWhiteTitle] = useState<string | null>(null);
const [blackTitle, setBlackTitle] = useState<string | null>(null);

  const chessboardOptions = {
    position,
    id: "position",
  };

  useEffect(() => {
    const startStream = async () => {
     const response = await fetch(`/api/tv/${mode}`);

      await readNdjsonStream(response, (data) => {
        const event = data as LichessFenEvent;

  if (event.t === "fen" && event.d) {
    setPosition(event.d.fen);
    setWhiteTime(event.d.wc);
    setBlackTime(event.d.bc);
  }
  if (event.t === "featured" && event.d) {
    // set initial board from featured event
    setPosition(event.d.fen);

    const white = event.d.players.find((p) => p.color === "white");
    const black = event.d.players.find((p) => p.color === "black");

    if (white) {
      setWhitePlayer(white.user.name);
      setWhiteRating(white.rating);
      setWhiteTitle(white.user.title ?? null);
      setWhiteTime(white.seconds);
    }

    if (black) {
      setBlackPlayer(black.user.name);
      setBlackRating(black.rating);
      setBlackTitle(black.user.title ?? null);
      setBlackTime(black.seconds);
    }
  }
      });
    };

    startStream();
  }, []);

return (
  <div
    className="flex flex-col items-center justify-center p-4
               bg-gray-100 dark:bg-zinc-950 transition-colors duration-300"
  >
    <div className="w-full mb-4 text-center">
      <div
        className="inline-block px-4 py-2 rounded-lg shadow-md
                  bg-zinc-800 text-white
                  dark:bg-zinc-200 dark:text-black
                  font-semibold tracking-wide uppercase text-sm"
      >
        {mode} TV
      </div>
    </div>
    <div
      className="w-[350px]
                 bg-white dark:bg-zinc-900
                 rounded-2xl shadow-xl p-2
                 text-black dark:text-white
                 transition-colors duration-300"
    >
      <PlayerCard
        title={blackTitle}
        name={blackPlayer}
        rating={blackRating}
        time={blackTime}
        position="top"
        formatTime={formatTime}
      />

      <div className="rounded-md overflow-hidden shadow-md">
        <Chessboard options={chessboardOptions} />
      </div>

      <PlayerCard
        title={whiteTitle}
        name={whitePlayer}
        rating={whiteRating}
        time={whiteTime}
        position="bottom"
        formatTime={formatTime}
      />
    </div>
  </div>
);
}


