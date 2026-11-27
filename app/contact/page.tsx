import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ContactCTA } from "@/components/contact/ContactCTA";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { RoutingCards } from "@/components/contact/RoutingCards";
import { contactCopy, contactHero } from "@/data/contact";

export const metadata: Metadata = {
  title: contactCopy.metadataTitle,
  description: contactCopy.metadataDescription,
  openGraph: {
    title: contactCopy.metadataTitle,
    description: contactCopy.metadataDescription,
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: contactHero.image,
        width: 1200,
        height: 630,
        alt: "Ferdinand Omanyala on the track",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactHero />
        <section
          id="contact"
          aria-labelledby="contact-form-heading"
          className="border-t border-white/10 bg-[#0A0A0A] px-6 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="mx-auto grid w-full min-w-0 max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <ContactForm />
            <ContactDetails />
          </div>
        </section>
        <RoutingCards />
        <FaqAccordion />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}