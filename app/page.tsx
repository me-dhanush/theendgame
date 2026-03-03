"use client";

import { useEffect, useState } from "react";
import { readNdjsonStream } from "@/lib/readNdjsonStream";
import { Chessboard } from "react-chessboard";

type LichessFenEvent = {
  t: string;
  d?: {
    fen: string;
    wc: number;
    bc: number;
  };
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function LiveFeed() {
  const [position, setPosition] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);

  const chessboardOptions = {
    position,
    id: "position",
  };

  useEffect(() => {
    const startStream = async () => {
      const response = await fetch("/api/tv/bullet");

      await readNdjsonStream(response, (data) => {
        const event = data as LichessFenEvent;

        if (event.t === "fen" && event.d) {
          setPosition(event.d.fen);
          setWhiteTime(event.d.wc);
          setBlackTime(event.d.bc);
        }
      });
    };

    startStream();
  }, []);

  return (
    <div style={{ width: 400, margin: "auto", textAlign: "center" }}>
      {/* Black Clock */}
      <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        ⬛ {formatTime(blackTime)}
      </div>

      <Chessboard options={chessboardOptions} />

      {/* White Clock */}
      <div style={{ fontSize: 22, fontWeight: "bold", marginTop: 10 }}>
        ⬜ {formatTime(whiteTime)}
      </div>
    </div>
  );
}
