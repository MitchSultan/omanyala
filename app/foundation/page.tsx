import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FoundationHero } from "@/components/foundation/FoundationHero";
import { FoundationAbout } from "@/components/foundation/FoundationAbout";
import { VisionMissionPassions } from "@/components/foundation/VisionMissionPassions";
import { ProjectsCarousel } from "@/components/foundation/ProjectsCarousel";

export const metadata: Metadata = {
  title: "Omanyala Foundation — Building Pathways From Every Starting Line",
  description:
    "Discover the Omanyala Foundation Trust: grassroots athletics, Street Sprint Festival, Omanyala Sprint Club, and youth empowerment across Kenya.",
  openGraph: {
    title: "Omanyala Foundation — Building Pathways From Every Starting Line",
    description:
      "Empowering young Kenyan athletes through grassroots sprint clinics, community festivals, and education.",
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: "/found.jpeg",
        width: 1200,
        height: 630,
        alt: "Omanyala Foundation Trust",
      },
    ],
  },
};

export default function FoundationPage() {
  return (
    <>
      <Navbar />
      <main>
        <FoundationHero />
        <FoundationAbout />
        <VisionMissionPassions />
        <ProjectsCarousel />
      </main>
      <Footer />
    </>
  );
}
