import { Prisma } from "@prisma/client";
import { BracketLayout } from "./BracketSVG";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateMatchResult } from "@/lib/actions/updateMatchResult";
import { useRouter } from "next/navigation";

type RoundWithMatches = Prisma.RoundGetPayload<{
  include: {
    matches: {
      include: {
        player1: {
          include: { user: true };
        };
        player2: {
          include: { user: true };
        };
      };
    };
  };
}>;

export interface MatchNodesProps {
  rounds: RoundWithMatches[];
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
const router = useRouter();
const [saving, setSaving] = useState(false);
const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    score1: "",
    score2: "",
  });

  async function handleSave(matchId: string) {
    try {
      setSaving(true);

      await updateMatchResult(
        matchId,
        Number(formData.score1),
        Number(formData.score2),
      );
setActiveMatchId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to update match", error);
    } finally {
      setSaving(false);
    }
  }

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

          const player1 =
            match.player1?.user?.username ?? match.player1?.lichessId ?? "TBD";

          const player2 =
            match.player2?.user?.username ?? match.player2?.lichessId ?? "TBD";

          const score1 = match.score1 ?? "-";
          const score2 = match.score2 ?? "-";

          return (
            <Popover
              key={match.id}
              open={activeMatchId === match.id}
              onOpenChange={(open) => {
                if (open) {
                  setActiveMatchId(match.id);

                  setFormData({
                    score1: match.score1?.toString() ?? "",
                    score2: match.score2?.toString() ?? "",
                  });
                } else {
                  setActiveMatchId(null);
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
                      {/* Player 1 */}
                      <rect
                        x={0}
                        y={0}
                        width={nodeWidth}
                        height={nodeHeight / 2 - 4}
                        rx="6"
                        className={`transition-all duration-200 ${
                          isHovered
                            ? "fill-blue-700 dark:fill-blue-300"
                            : "fill-blue-950 dark:fill-blue-100"
                        } stroke-blue-800 dark:stroke-blue-400`}
                      />

                      {/* Player 2 */}
                      <rect
                        x={0}
                        y={nodeHeight / 2 + 4}
                        width={nodeWidth}
                        height={nodeHeight / 2 - 4}
                        rx="6"
                        className={`transition-all duration-200 ${
                          isHovered
                            ? "fill-blue-700 dark:fill-blue-300"
                            : "fill-blue-950 dark:fill-blue-100"
                        } stroke-blue-800 dark:stroke-blue-400`}
                      />

                      <text
                        x={14}
                        y={22}
                        fontSize="14"
                        className="fill-white dark:fill-blue-950"
                      >
                        {player1}
                      </text>

                      <text
                        x={nodeWidth - 20}
                        y={22}
                        textAnchor="end"
                        className="fill-white dark:fill-blue-950 font-semibold"
                      >
                        {score1}
                      </text>

                      <text
                        x={14}
                        y={nodeHeight / 2 + 26}
                        fontSize="14"
                        className="fill-white dark:fill-blue-950"
                      >
                        {player2}
                      </text>

                      <text
                        x={nodeWidth - 20}
                        y={nodeHeight / 2 + 26}
                        textAnchor="end"
                        className="fill-white dark:fill-blue-950 font-semibold"
                      >
                        {score2}
                      </text>
                    </svg>
                  </div>
                </foreignObject>
              </PopoverTrigger>

              <PopoverContent
                side="right"
                align="start"
                sideOffset={14}
                className="w-80 p-4"
              >
                <div className="space-y-5">
                  {/* Header */}
                  <div className="text-sm font-semibold text-muted-foreground">
                    Update Match Score
                  </div>

                  {/* Player 1 */}
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="font-medium truncate">{player1}</span>

                    <Input
                      type="number"
                      step="0.5"
                      value={formData.score1}
                      className="w-20 text-center font-semibold"
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          score1: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* VS Divider */}
                  <div className="text-center text-xs text-muted-foreground font-medium">
                    VS
                  </div>

                  {/* Player 2 */}
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="font-medium truncate">{player2}</span>

                    <Input
                      type="number"
                      step="0.5"
                      value={formData.score2}
                      className="w-20 text-center font-semibold"
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          score2: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* Quick result buttons */}
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      className="bg-muted hover:bg-blue-100 dark:hover:bg-blue-900/30 text-foreground"
                      onClick={() =>
                        setFormData({
                          score1: "1",
                          score2: "0",
                        })
                      }
                    >
                      1–0
                    </Button>

                    <Button
                      size="sm"
                      className="bg-muted hover:bg-muted/70 text-foreground"
                      onClick={() =>
                        setFormData({
                          score1: "0.5",
                          score2: "0.5",
                        })
                      }
                    >
                      ½–½
                    </Button>

                    <Button
                      size="sm"
                      className="bg-muted hover:bg-blue-100 dark:hover:bg-blue-900/30 text-foreground"
                      onClick={() =>
                        setFormData({
                          score1: "0",
                          score2: "1",
                        })
                      }
                    >
                      0–1
                    </Button>
                  </div>
                  {/* Save button */}
                  <Button
                    className="w-full mt-2"
                    disabled={
                      saving || formData.score1 === "" || formData.score2 === ""
                    }
                    onClick={() => handleSave(match.id)}
                  >
                    {saving ? "Saving..." : "Save Score"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          );
        });
      })}
    </>
  );
}
