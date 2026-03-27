import { Users, Layers } from "lucide-react";

/* ------------------ STATUS BADGE ------------------ */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    LIVE: "bg-green-100 text-green-700",
    UPCOMING: "bg-yellow-100 text-yellow-700",
    FINISHED: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-md ${styles[status] || styles.FINISHED}`}
    >
      {status}
    </span>
  );
}

/* ------------------ STAT ------------------ */
function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: any;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={18} className="opacity-60" />
      <div className="flex gap-2 text-sm">
        <span className="opacity-60">{label}:</span>
        <span className="font-semibold">{value}</span>
      </div>
    </div>
  );
}

/* ------------------ HEADER ------------------ */
export default function TournamentHeader({ tournament, players, rounds }: any) {
  return (
    <div className="border-b bg-background py-8 sm:py-10">
      <div
        className="
          max-w-7xl mx-auto
          px-6 sm:px-10 lg:px-16
        "
      >
        <div
          className="
            flex flex-col md:flex-row
            md:items-center justify-between
            gap-6 md:gap-10
          "
        >
          {/* LEFT */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                {tournament.name}
              </h1>

              <StatusBadge status={tournament.status} />
            </div>

            <p className="text-sm sm:text-base text-muted-foreground">
              Hosted by{" "}
              <span className="font-medium text-foreground">
                {tournament.host.username}
              </span>
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex gap-6 sm:gap-8 flex-wrap text-sm">
            <Stat label="Players" value={players.length} icon={Users} />
            <Stat label="Rounds" value={rounds.length} icon={Layers} />
          </div>
        </div>
      </div>
    </div>
  );
}
