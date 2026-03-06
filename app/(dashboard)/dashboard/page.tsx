import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Background Grid */}
      <InteractiveGridPattern
        className="absolute inset-0 opacity-30"
        width={60}
        height={60}
        squares={[100, 100]}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Welcome */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
          Welcome, {user.username} ♟️
        </h1>

        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Manage your tournaments, generate brackets, and control the arena.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Link
            href="/dashboard/create-tournament"
            className="px-8 py-4 bg-secondary text-white text-lg font-semibold rounded-md hover:opacity-90 transition"
          >
            Create Tournament
          </Link>

          <Link
            href="/dashboard/tournaments"
            className="px-8 py-4 border border-border text-lg font-semibold rounded-md hover:bg-accent transition"
          >
            My Tournaments
          </Link>
        </div>

        {/* Logout */}
        <form action="/api/logout" method="POST" className="mt-12">
          <button className="text-sm text-muted-foreground hover:text-primary transition">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
