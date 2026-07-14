"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: number;
  alt: string;
  src: string;
}

// Mock logo data – replace the `src` with your actual logo paths
const defaultLogos: Logo[] = [
  { id: 1, alt: "ToG", src: "/1.png" },
  { id: 2, alt: "Luxury by Tina", src: "/2.png" },
  { id: 3, alt: "CanvasPile", src: "/4.png" },
  { id: 4, alt: "MadGraphix", src: "/8.png" },
  { id: 5, alt: "Evolve Sphere", src: "/medex.png" },
];

export function Partners({ logos = defaultLogos }: { logos?: Logo[] }) {
  // Handle case where logos is undefined or empty
  if (!logos || logos.length === 0) {
    return null; // or return a fallback UI
  }

  return (
    <section className="py-16 md:py-24  overflow-hidden">
      {/* Optional heading */}
      <div className="max-w-6xl mx-auto mb-10 px-4 text-center">
        <h2 className="text-4xl text-white font-semibold uppercase">
          We've partnered with
        </h2>
      </div>

      {/* Carousel container */}
      <div className="max-w-7xl h-48 mx-auto">
        <Carousel
          opts={{
            loop: true,
            align: "start",
            dragFree: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="flex items-center">
            {logos.map((logo) => (
              <CarouselItem
                key={`${logo.id}-${logo.alt}`} // Using alt as backup uniqueness
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-8 first:pl-0"
              >
                <div className="flex  items-center justify-center p-2 opacity-70 hover:opacity-100 transition-all duration-500">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={60}
                    className="h-16 sm:h-12 md:h-24 w-auto object-contain"
                    priority={logo.id <= 2} // Prioritize first 2 logos
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}