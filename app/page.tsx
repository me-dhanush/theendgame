import { HeroSection } from "@/components/sections/hero-section";
import LiveFeed from "@/components/sections/live-feed";
import SVGBracket from "@/components/ui/SVGBracket";
import { testRounds } from "@/lib/pairing";


export default function home () {
  return (
    <div>
      {" "}
      <HeroSection />
      <LiveFeed />
      <SVGBracket rounds={testRounds} />
    </div>
  );
}