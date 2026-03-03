import { RoundType } from "@/lib/pairing";
import { BracketLayout } from "./BracketSVG";

export interface MatchNodesProps {
  rounds: RoundType[];
  totalHeight: number;
  layout: BracketLayout;
  hoveredMatch: string | null;
  setHoveredMatch: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function MatchNodes({
  rounds,
  totalHeight,
  layout,
  hoveredMatch,
  setHoveredMatch,
}: MatchNodesProps) {
  const { nodeWidth, nodeHeight, horizontalGap, paddingX } = layout;

  return (
    <>
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
              {/* Player 1 */}
              <rect
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight / 2 - 4}
                rx="6"
                className={`transition-all duration-200 ${
                  isHovered
                    ? "fill-blue-700 dark:fill-blue-300"
                    : "fill-blue-950 dark:fill-blue-100"
                } stroke-blue-800 dark:stroke-blue-400`}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={isHovered ? "url(#glow)" : undefined}
              />

              {/* Player 2 */}
              <rect
                x={x}
                y={y + nodeHeight / 2 + 4}
                width={nodeWidth}
                height={nodeHeight / 2 - 4}
                rx="6"
                className={`transition-all duration-200 ${
                  isHovered
                    ? "fill-blue-700 dark:fill-blue-300"
                    : "fill-blue-950 dark:fill-blue-100"
                } stroke-blue-800 dark:stroke-blue-400`}
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
    </>
  );
}
