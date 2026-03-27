import Link from "next/link";
import { getTournaments } from "@/lib/actions/getTournaments";

export default async function TournamentsSection() {
  const tournaments = await getTournaments();

  return (
    <section id="view-tournaments" className="max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-4xl font-bold tracking-tight">Tournaments</h2>
        <p className="text-muted-foreground text-sm">
          Explore and join ongoing competitions
        </p>
      </div>

      {/* Grid */}
      <div className="-mx-6 grid sm:grid-cols-2 gap-8">
        {tournaments.map((t: any) => (
          <Link key={t.id} href={`/tournament/${t.id}`} className="group">
            <div className="h-full rounded-2xl border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold group-hover:text-primary transition">
                  {t.name}
                </h3>

                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize
                  ${
                    t.status === "started"
                      ? "bg-green-500/10 text-green-600"
                      : t.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {t.description || "No description available"}
              </p>

              {/* Info Grid */}
              <div className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Players</p>
                  <p className="font-medium">{t.members?.length ?? 0}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Rounds</p>
                  <p className="font-medium">{t.currentRoundNumber}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Time</p>
                  <p className="font-medium">
                    {t.timeMinutes}+{t.timeIncrement}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="font-medium">{t.rated ? "Rated" : "Casual"}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Host: <span className="font-medium">{t.host?.username}</span>
                </p>

                <span className="text-primary opacity-0 group-hover:opacity-100 transition">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty */}
      {tournaments.length === 0 && (
        <div className="text-center mt-20 text-muted-foreground">
          No tournaments yet 😅
        </div>
      )}
    </section>
  );
}