"use client";

import { useRouter } from "next/navigation";
import CreateTournamentForm from "@/components/ui/CreateTournamentForm";

export default function Page() {
  const router = useRouter();

  function handleGenerate(tournamentId: string) {
    router.push(`/tournament/${tournamentId}`);
  }

  return <CreateTournamentForm onGenerate={handleGenerate} />;
}
