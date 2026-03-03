import { HeroSection } from "@/components/sections/hero-section";
import LiveFeed from "@/components/sections/live-feed";
import { Separator } from "@/components/ui/separator";
import SVGBracket from "@/components/ui/SVGBracket";
import { testRounds } from "@/lib/pairing";


export default function home () {
  return (
    <div>
      {" "}
      <HeroSection />
      <Separator />
      <LiveFeed />
      <Separator />
      <SVGBracket rounds={testRounds} />
    </div>
  );
}