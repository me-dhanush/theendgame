export default function TournamentPlayers({ players }: any) {
  return (
    <div className="max-w-[700px] space-y-3">
      {players
        .sort((a: any, b: any) => b.rating - a.rating)
        .map((p: any) => (
          <div
            key={p.id}
            className="flex items-center justify-between border border-border bg-muted/20 px-4 py-3 rounded-lg hover:bg-muted/40 transition"
          >
            <div className="font-medium">{p.user.username}</div>

            <div className="text-sm opacity-70">Rating {p.rating}</div>
          </div>
        ))}
    </div>
  );
}
