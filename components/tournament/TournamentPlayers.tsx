import { Users } from "lucide-react";

export default function TournamentPlayers({ players }: any) {
  const sortedPlayers = [...players].sort(
    (a: any, b: any) => b.rating - a.rating,
  );

  return (
    <div
      className="
        max-w-7xl mx-auto
        px-6 sm:px-10 lg:px-16
        py-6 sm:py-8
      "
    >
      <div className="space-y-4 sm:space-y-5">
        {sortedPlayers.map((p: any, index: number) => (
          <div
            key={p.id}
            className="
              flex items-center justify-between
              gap-4
              border border-border
              bg-background
              px-4 sm:px-5
              py-3 sm:py-4
              rounded-lg
              hover:bg-muted/30
              transition
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0">
              <Users size={18} className="opacity-60 shrink-0" />

              <div className="truncate">
                <p className="text-sm sm:text-base font-medium truncate">
                  {p.user.username}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-xs sm:text-sm opacity-70 whitespace-nowrap">
              Rating{" "}
              <span className="font-semibold text-foreground">{p.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
