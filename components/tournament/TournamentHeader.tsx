import { handleNextRound } from "@/lib/actions/handleNextRound";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/40 px-4 py-2 rounded-lg">
      <p className="opacity-60 text-xs">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

export default function TournamentHeader({
  tournament,
  players,
  rounds,
}: any) {
  return (
    <div className="border-b border-border bg-muted/30 px-12 py-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{tournament.name}</h1>

        <p className="opacity-70 mt-2">
          Hosted by{" "}
          <span className="font-semibold">{tournament.host.username}</span>
        </p>
      </div>

      <div className="flex items-center gap-10 text-sm">
        <Stat label="Players" value={players.length} />
        <Stat label="Rounds" value={rounds.length} />
      </div>
    </div>
  );
}
