export default function MatchCard({ match }: any) {
  const games = match.games ?? [];

  function formatScore(score: number | null) {
    if (score === null) return "-";
    if (score === 0.5) return "½";
    return score;
  }

  return (
    <div className="bg-[#f1f3f3] dark:bg-[#394447] border border-border rounded-xl p-6 space-y-3">
      {/* PLAYERS */}
      <div className="flex justify-between font-medium">
        <span>{match.player1?.user?.username ?? "TBD"}</span>
        <span>{formatScore(match.score1)}</span>
      </div>

      <div className="flex justify-between font-medium">
        <span>{match.player2?.user?.username ?? "TBD"}</span>
        <span>{formatScore(match.score2)}</span>
      </div>

      {/* GAMES */}
      <div className="border-t border-border pt-3 flex flex-wrap gap-2">
        {games.map((g: any, i: number) => {
          let result = "–";

          if (g.whiteScore !== null && g.blackScore !== null) {
            result = `${formatScore(g.whiteScore)}-${formatScore(g.blackScore)}`;
          }

          return (
            <a
              key={g.id}
              href={`https://lichess.org/${g.lichessId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group flex items-center gap-2 px-3 py-1.5 rounded-lg
                bg-mist-50 dark:bg-mist-900 border border-border
                transition-all duration-200
                hover:bg-primary/10 hover:border-primary
                hover:shadow-sm hover:-translate-y-[1px]
                cursor-pointer text-sm font-medium
              "
            >
              {/* Game number */}
              <span className="text-xs px-1.5 py-0.5 rounded rounded-full bg-background border border-border opacity-80">
                G{i + 1}
              </span>

              {/* Score */}
              <span className="font-semibold group-hover:underline">
                {result}
              </span>

              {/* External icon */}
              <span className="text-xs opacity-80 text-blue-900 font-bold group-hover:opacity-100">
                ↗
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
