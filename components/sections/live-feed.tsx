import TvBoard from "@/components/ui/tv-board";

export default function LiveFeed() {
  return (
    <div className="min-h-screen px-6 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Lichess TV</h1>
        <p className="text-neutral-400 mt-2">
          Live Bullet · Blitz · Rapid Games
        </p>
      </div>

      {/* Boards Container */}
      <div className="flex flex-wrap justify-center gap-10">
        <TvBoard mode="bullet" />
        <TvBoard mode="blitz" />
        <TvBoard mode="rapid" />
      </div>
    </div>
  );
}
