import { getTournamentById } from "@/lib/actions/getTournamentById";
import TournamentClient from "./TournamentClient";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tournament = await getTournamentById(id);

  return <TournamentClient tournament={tournament} />;
}
