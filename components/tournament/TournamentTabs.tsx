import { handleNextRound } from "@/lib/actions/handleNextRound";

export default function TournamentTabs({
  tab,
  setTab,
  tournamentId,
  canStartNextRound,
}: any) {
  const tabs = ["matches", "players", "bracket"];

  return (
    <div className="border-b bg-background">
      <div
        className="
          max-w-7xl mx-auto
          px-6 sm:px-10 lg:px-16
        "
      >
        <div
          className="
            flex items-center justify-between
            gap-6 md:gap-10
          "
        >
          {/* Tabs */}
          <div className="flex gap-6 sm:gap-8 text-sm sm:text-base">
            {tabs.map((t) => {
              const active = tab === t;

              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`
                    py-4
                    capitalize
                    whitespace-nowrap
                    border-b-2
                    transition-all duration-200

                    ${
                      active
                        ? "border-primary text-foreground font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Action */}
          {canStartNextRound && (
            <form action={handleNextRound.bind(null, tournamentId)}>
              <button
                type="submit"
                className="
                  px-4 py-2
                  text-sm sm:text-base
                  rounded-md
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
      </div>
    </div>
  );
}
