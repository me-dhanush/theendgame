import MatchNodes from "./match-nodes";
import Connectors from "./connectors";
import { RoundType } from "@/lib/pairing";

export interface BracketLayout {
  nodeWidth: number;
  nodeHeight: number;
  horizontalGap: number;
  paddingX: number;
  paddingY: number;
}

export interface BracketSVGProps {
  rounds: RoundType[];
  hoveredMatch: string | null;
  setHoveredMatch: React.Dispatch<React.SetStateAction<string | null>>;
  layout: BracketLayout;
}

export default function BracketSVG({
  rounds,
  hoveredMatch,
  setHoveredMatch,
  layout,
}: BracketSVGProps) {
  const { nodeHeight, horizontalGap, paddingX, paddingY } = layout;

  const firstRoundCount = rounds[0]?.matches.length ?? 0;

  const totalHeight = firstRoundCount * (nodeHeight + 60) + paddingY * 2;

  const totalWidth = rounds.length * horizontalGap + paddingX * 2;

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <svg width={totalWidth} height={totalHeight}>
        <defs>
          <filter id="glow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor="#3b82f6"
              floodOpacity="0.9"
            />
          </filter>
        </defs>

        <MatchNodes
          rounds={rounds}
          totalHeight={totalHeight}
          layout={layout}
          hoveredMatch={hoveredMatch}
          setHoveredMatch={setHoveredMatch}
        />

        <Connectors
          rounds={rounds}
          totalHeight={totalHeight}
          layout={layout}
          hoveredMatch={hoveredMatch}
        />
      </svg>
    </div>
  );
}
