export default function MatchCard({ match }: any) {
  const games = match.games ?? [];

  return (
    <div className="border border-border rounded-xl p-5 bg-muted/20 space-y-3">
      {/* PLAYERS */}
      <div className="flex justify-between font-medium">
        <span>{match.player1?.user?.username ?? "TBD"}</span>
        <span>{match.score1 ?? "-"}</span>
      </div>

      <div className="flex justify-between font-medium">
        <span>{match.player2?.user?.username ?? "TBD"}</span>
        <span>{match.score2 ?? "-"}</span>
      </div>

      {/* GAMES */}
      <div className="border-t border-border pt-3 flex flex-wrap gap-2">
        {games.map((g: any, i: number) => {
          let result = "–";

          if (g.winnerColor === "white") result = "1-0";
          if (g.winnerColor === "black") result = "0-1";

          return (
            <a
              key={g.id}
              href={`https://lichess.org/${g.lichessId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-md
                         bg-muted border border-border
                         hover:bg-primary/10 hover:border-primary
                         cursor-pointer transition text-sm font-medium"
            >
              <span className="opacity-70">Game{i + 1}</span>
              <span>{result}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
