import { RoundSlot } from "@/lib/pairing";
import { BracketLayout } from "./BracketSVG";

export interface ConnectorsProps {
  rounds: RoundSlot[];
  totalHeight: number;
  layout: BracketLayout;
  hoveredMatch: string | null;
}

export default function Connectors({
  rounds,
  totalHeight,
  layout,
  hoveredMatch,
}: ConnectorsProps) {
  const { nodeWidth, nodeHeight, horizontalGap, paddingX } = layout;

  return (
    <>
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
              d={`M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`}
              fill="none"
              stroke={isHovered ? "#3b82f6" : "#64748b"}
              strokeWidth={isHovered ? 3 : 2}
              filter={isHovered ? "url(#glow)" : undefined}
              style={{ transition: "all 0.2s ease" }}
            />
          );
        });
      })}
    </>
  );
}
