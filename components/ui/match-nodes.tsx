import { RoundType } from "@/lib/pairing";
import { BracketLayout } from "./BracketSVG";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

const [formData, setFormData] = useState({
  player1: "",
  player2: "",
  score1: "",
  score2: "",
});
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
            <Popover
              key={match.id}
              onOpenChange={(open) => {
                if (open) {
                  setEditingMatchId(match.id);
                  setFormData({
                    player1: match.players[0]?.name ?? "",
                    player2: match.players[1]?.name ?? "",
                    score1: match.scores[0]?.toString() ?? "",
                    score2: match.scores[1]?.toString() ?? "",
                  });
                } else {
                  setEditingMatchId(null);
                }
              }}
            >
              <PopoverTrigger asChild>
                <foreignObject
                  x={x}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredMatch(match.id)}
                  onMouseLeave={() => setHoveredMatch(null)}
                >
                  <div className="w-full h-full">
                    <svg width={nodeWidth} height={nodeHeight}>
                      {/* your existing svg stays unchanged */}
                      <rect
                        x={0}
                        y={0}
                        width={nodeWidth}
                        height={nodeHeight / 2 - 4}
                        rx="6"
                        className={`transition-all duration-200 ${
                          hoveredMatch === match.id
                            ? "fill-blue-700 dark:fill-blue-300"
                            : "fill-blue-950 dark:fill-blue-100"
                        } stroke-blue-800 dark:stroke-blue-400`}
                        strokeWidth={hoveredMatch === match.id ? 2.5 : 1.5}
                      />

                      <rect
                        x={0}
                        y={nodeHeight / 2 + 4}
                        width={nodeWidth}
                        height={nodeHeight / 2 - 4}
                        rx="6"
                        className={`transition-all duration-200 ${
                          hoveredMatch === match.id
                            ? "fill-blue-700 dark:fill-blue-300"
                            : "fill-blue-950 dark:fill-blue-100"
                        } stroke-blue-800 dark:stroke-blue-400`}
                        strokeWidth={hoveredMatch === match.id ? 2.5 : 1.5}
                      />

                      <text
                        x={14}
                        y={22}
                        fontSize="14"
                        className="fill-white dark:fill-blue-950"
                      >
                        {match.players[0]?.name ?? "TBD"}
                      </text>

                      <text
                        x={nodeWidth - 20}
                        y={22}
                        fontSize="14"
                        textAnchor="end"
                        className="fill-white dark:fill-blue-950 font-semibold"
                      >
                        {match.scores[0] ?? "-"}
                      </text>

                      <text
                        x={14}
                        y={nodeHeight / 2 + 26}
                        fontSize="14"
                        className="fill-white dark:fill-blue-950"
                      >
                        {match.players[1]?.name ?? "TBD"}
                      </text>

                      <text
                        x={nodeWidth - 20}
                        y={nodeHeight / 2 + 26}
                        fontSize="14"
                        textAnchor="end"
                        className="fill-white dark:fill-blue-950 font-semibold"
                      >
                        {match.scores[1] ?? "-"}
                      </text>
                    </svg>
                  </div>
                </foreignObject>
              </PopoverTrigger>

              <PopoverContent
                side="right"
                align="start"
                sideOffset={14}
                className="w-96 p-0 overflow-hidden"
              >
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="px-6 py-4 border-b bg-muted/40">
                    <h4 className=" font-semibold tracking-tight">
                      Edit Match
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Update players and adjust scores
                    </p>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-5 space-y-6">
                    {/* Player 1 Card */}
                    <div className="rounded-lg border p-4 space-y-3 bg-background">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Player 1
                        </span>

                        <Input
                          type="number"
                          className="w-16 text-center font-semibold"
                          value={formData.score1}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              score1: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <Input
                        value={formData.player1}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            player1: e.target.value,
                          }))
                        }
                        placeholder="Enter player name"
                      />
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border-t" />
                      <span className="text-xs text-muted-foreground font-medium">
                        VS
                      </span>
                      <div className="flex-1 border-t" />
                    </div>

                    {/* Player 2 Card */}
                    <div className="rounded-lg border p-4 space-y-3 bg-background">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Player 2
                        </span>

                        <Input
                          type="number"
                          className="w-16 text-center font-semibold"
                          value={formData.score2}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              score2: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <Input
                        value={formData.player2}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            player2: e.target.value,
                          }))
                        }
                        placeholder="Enter player name"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t bg-muted/30 flex justify-end">
                    <Button
                      size="sm"
                      className="px-6"
                      onClick={() => {
                        console.log("Updated Match:", match.id, formData);
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        });
      })}
    </>
  );
}
