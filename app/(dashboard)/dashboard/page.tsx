import { getTournaments } from "@/lib/actions/getTournaments";
import Link from "next/link";

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">
        All Tournaments
      </h1>

      {tournaments.length === 0 && (
        <p className="text-gray-500 text-lg">No tournaments yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <Link
            key={tournament.id}
            href={`/tournament/${tournament.id}`}
            className="group border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Header */}
            <div className="mb-3">
              <h2 className="text-xl font-semibold group-hover:text-black transition">
                {tournament.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Hosted by {tournament.host?.username || "Unknown"}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 mt-4">
              <div className="flex flex-col">
                <span className="font-medium text-black">
                  {tournament.members.length}
                </span>
                <span className="text-xs text-gray-500">Players</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-black">
                  {tournament.rounds.length}
                </span>
                <span className="text-xs text-gray-500">Rounds</span>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-5">
              Created {new Date(tournament.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
