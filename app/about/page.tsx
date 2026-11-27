import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { StoryTimeline } from "@/components/about/StoryTimeline";
import { RaceCarousel } from "@/components/about/RaceCarousel";
import { AwardsSection } from "@/components/about/AwardsSection";

export const metadata: Metadata = {
  title: "About — Ferdinand Omanyala | Africa's Fastest Man",
  description:
    "Explore the story behind the speed: from rugby fields in Nairobi to breaking the African 100m record, signature race highlights, and major accolades.",
  openGraph: {
    title: "About — Ferdinand Omanyala | Africa's Fastest Man",
    description:
      "Explore the story behind the speed: from rugby fields in Nairobi to breaking the African 100m record, signature race highlights, and major accolades.",
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: "/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Ferdinand Omanyala on the track",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <StoryTimeline />
        <RaceCarousel />
        <AwardsSection />
      </main>
      <Footer />
    </>
  );
}
