"use client";
import { RoundType } from "@/lib/pairing";
import React, { useState } from "react";

interface Props {
  rounds: RoundType[];
}

export default function SVGBracket({ rounds }: Props) {
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null);

  const nodeWidth = 200;
  const nodeHeight = 90;
  const horizontalGap = 260;
  const paddingX = 60;
  const paddingY = 60;

  const firstRoundCount = rounds[0]?.matches.length ?? 0;

  const totalHeight = firstRoundCount * (nodeHeight + 60) + paddingY * 2;

  const totalWidth = rounds.length * horizontalGap + paddingX * 2;

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <svg width={totalWidth} height={totalHeight}>
        {/* Glow Filter */}
        <defs>
          <filter id="glow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor="#3b82f6" // blue-500 glow
              floodOpacity="0.9"
            />
          </filter>
        </defs>

        {/* MATCH BOXES */}
        {rounds.map((round, roundIndex) => {
          const matchCount = round.matches.length;
          const freeSpace = totalHeight - matchCount * nodeHeight;
          const space = freeSpace / (matchCount + 1);

          return round.matches.map((match, matchIndex) => {
            const x = roundIndex * horizontalGap + paddingX;
            const y = space * (matchIndex + 1) + nodeHeight * matchIndex;

            const isHovered = hoveredMatch === match.id;

            return (
              <g
                key={match.id}
                onMouseEnter={() => setHoveredMatch(match.id)}
                onMouseLeave={() => setHoveredMatch(null)}
                className="cursor-pointer"
              >
                {/* Player 1 Box */}
                <rect
                  x={x}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight / 2 - 4}
                  rx="6"
                  className={`
      transition-all duration-200
      ${
        isHovered
          ? "fill-blue-700 dark:fill-blue-300"
          : "fill-blue-950 dark:fill-blue-100"
      }
      stroke-blue-800 dark:stroke-blue-400
    `}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  filter={isHovered ? "url(#glow)" : undefined}
                />

                {/* Player 2 Box */}
                <rect
                  x={x}
                  y={y + nodeHeight / 2 + 4}
                  width={nodeWidth}
                  height={nodeHeight / 2 - 4}
                  rx="6"
                  className={`
      transition-all duration-200
      ${
        isHovered
          ? "fill-blue-700 dark:fill-blue-300"
          : "fill-blue-950 dark:fill-blue-100"
      }
      stroke-blue-800 dark:stroke-blue-400
    `}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  filter={isHovered ? "url(#glow)" : undefined}
                />

                {/* Player 1 Text */}
                <text
                  x={x + 14}
                  y={y + 22}
                  fontSize="14"
                  className="fill-white dark:fill-blue-950"
                >
                  {match.players[0]?.name ?? "TBD"}
                </text>
                <text
                  x={x + nodeWidth - 20}
                  y={y + 22}
                  fontSize="14"
                  textAnchor="end"
                  className="fill-white dark:fill-blue-950 font-semibold"
                >
                  {match.scores[0] ?? "-"}
                </text>

                {/* Player 2 Text */}
                <text
                  x={x + 14}
                  y={y + nodeHeight / 2 + 26}
                  fontSize="14"
                  className="fill-white dark:fill-blue-950"
                >
                  {match.players[1]?.name ?? "TBD"}
                </text>
                <text
                  x={x + nodeWidth - 20}
                  y={y + nodeHeight / 2 + 26}
                  fontSize="14"
                  textAnchor="end"
                  className="fill-white dark:fill-blue-950 font-semibold"
                >
                  {match.scores[1] ?? "-"}
                </text>
              </g>
            );
          });
        })}

        {/* CONNECTORS */}
        {rounds.map((round, roundIndex) => {
          if (roundIndex === rounds.length - 1) return null;

          const currentCount = round.matches.length;
          const nextRound = rounds[roundIndex + 1];
          const nextCount = nextRound.matches.length;

          const currentFree = totalHeight - currentCount * nodeHeight;
          const currentSpace = currentFree / (currentCount + 1);

          const nextFree = totalHeight - nextCount * nodeHeight;
          const nextSpace = nextFree / (nextCount + 1);

          return round.matches.map((match, matchIndex) => {
            const nextMatchIndex = Math.floor(matchIndex / 2);

            const x1 = roundIndex * horizontalGap + paddingX + nodeWidth;

            const y1 =
              currentSpace * (matchIndex + 1) +
              nodeHeight * matchIndex +
              nodeHeight / 2;

            const x2 = (roundIndex + 1) * horizontalGap + paddingX;

            const y2 =
              nextSpace * (nextMatchIndex + 1) +
              nodeHeight * nextMatchIndex +
              nodeHeight / 2;

            const midX = x1 + 30;
            const isHovered = hoveredMatch === match.id;

            return (
              <path
                key={`${match.id}-connector`}
                d={`
                  M ${x1} ${y1}
                  H ${midX}
                  V ${y2}
                  H ${x2}
                `}
                fill="none"
                stroke={isHovered ? "#3b82f6" : "#64748b"}
                strokeWidth={isHovered ? 3 : 2}
                filter={isHovered ? "url(#glow)" : undefined}
                style={{ transition: "all 0.2s ease" }}
              />
            );
          });
        })}
      </svg>
    </div>
  );
}
