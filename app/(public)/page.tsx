import { HeroSection } from "@/components/sections/hero-section";
import LiveFeed from "@/components/sections/live-feed";
import TournamentBracket from "@/components/sections/tournament-bracket";
import TournamentsSection from "@/components/sections/TournamentsSection";
import { Separator } from "@/components/ui/separator";
import { testRounds } from "@/lib/pairing";


export default function home () {
  return (
    <div>
      {" "}
      <HeroSection />
      {/* <Separator />
      <LiveFeed /> */}
      {/* <Separator />
      <TournamentBracket rounds={testRounds} /> */}
      <Separator />
      <TournamentsSection />
    </div>
  );
}