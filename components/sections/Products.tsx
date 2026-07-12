"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/mock-data";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function Products() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const cards = el.querySelectorAll("[data-product-card]");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: i * 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      id="shop"
      ref={sectionRef}
      className="border-t border-white/10 bg-[#0F0F0F] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              Running products
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl">
              Gear for the next rep, the next race.
            </h2>
          </div>
          <Link
            href="#"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4FF3F] transition-colors hover:text-[#F5F5F0]"
          >
            View Full Store →
          </Link>
        </div>

        {/* MOCK PRODUCTS: placeholder data — replace with real merchandise */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product.name}
              data-product-card
              className="group overflow-hidden border-white/10 bg-[#111111] p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(212,255,63,0.06)]"
            >
              {/* PLACEHOLDER IMAGE */}
              <div className="relative h-52 overflow-hidden bg-[#1A1A1A]">
                <Image
                  src="/images/product-placeholder.jpg"
                  alt={product.imageLabel}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#F5F5F0]">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {product.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-[#D4FF3F]">
                    {product.price}
                  </span>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 px-4 py-2 text-sm transition-colors hover:border-[#D4FF3F]/50 hover:text-[#D4FF3F]"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
