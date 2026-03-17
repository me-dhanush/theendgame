export default function TournamentTabs({ tab, setTab }: any) {
  const tabs = ["matches", "players", "bracket"];

  return (
    <div className="border-b border-border bg-muted/20 px-12 flex gap-6 text-sm">
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
  );
}
