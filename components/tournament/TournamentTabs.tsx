import { handleNextRound } from "@/lib/actions/handleNextRound";

export default function TournamentTabs({ tab, setTab, tournamentId, canStartNextRound }: any) {
  const tabs = ["matches", "players", "bracket"];
  return (
    <div className="border-b border-border bg-muted/20 px-12 flex items-center justify-between text-sm">
      {/* Tabs */}
      <div className="flex gap-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-4 capitalize border-b-2 transition ${
              tab === t
                ? "border-primary font-semibold"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      { canStartNextRound && (
        <form action={handleNextRound.bind(null, tournamentId)}>
          <button
            type="submit"
            className="
    ml-auto
    px-4 py-2
    rounded-lg
    bg-primary/10
    text-primary
    font-medium
    border border-primary/20
    hover:bg-primary/20
    hover:border-primary/40
    active:scale-[0.97]
    transition-all duration-200
  "
          >
            Start Next Round
          </button>
        </form>
      )}
    </div>
  );
}
