import Link from "next/link";
import { getTournaments } from "@/lib/actions/getTournaments";

export default async function TournamentsSection() {
  const tournaments = await getTournaments();

  return (
    <section id={"view-tournaments"} className="w-[70rem] mx-auto py-16">
      <div>
        {/* Title */}
        <h2 className="text-3xl font-bold mb-10">View Tournaments</h2>

        {/* Tournament List */}
        <div className="flex flex-col gap-8">
          {tournaments.map((tournament: any) => (
            <Link
              key={tournament.id}
              href={`/tournament/${tournament.id}`}
              className="block"
            >
              <div className="border rounded-xl p-6 hover:bg-muted/40 hover:scale-[1.01] transition cursor-pointer">
                <h3 className="text-xl font-semibold">{tournament.name}</h3>

                <p className="text-sm text-muted-foreground mt-2">
                  {tournament.description || "No description available"}
                </p>

                <div className="mt-4 text-sm text-muted-foreground">
                  Players: {tournament.players?.length ?? 0}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
