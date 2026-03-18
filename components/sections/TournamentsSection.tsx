import { getTournaments } from "@/lib/actions/getTournaments";


export default async function TournamentsSection() {
  const tournaments = await getTournaments();

  return (
    <section className="w-[70rem] mx-auto py-16">
      <div>
        {/* Title */}
        <h2 className="text-3xl font-bold mb-10">Tournaments</h2>

        {/* Tournament List */}
        <div className="flex flex-col gap-8">
          {tournaments.map((tournament: any) => (
            <div
              key={tournament.id}
              className="border rounded-xl p-6 hover:bg-muted/40 transition"
            >
              <h3 className="text-xl font-semibold">{tournament.name}</h3>

              <p className="text-sm text-muted-foreground mt-2">
                {tournament.description || "No description available"}
              </p>

              <div className="mt-4 text-sm text-muted-foreground">
                Players: {tournament.players?.length ?? 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
