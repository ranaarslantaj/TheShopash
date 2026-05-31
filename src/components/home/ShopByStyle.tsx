'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  num: string;
  name: string;
  blurb: string;
  image: string;
}

const CATEGORIES: Category[] = [
  {
    num: 'I',
    name: 'Dress',
    blurb: 'Refined. Slim. For the boardroom and beyond.',
    image:
      'https://images.unsplash.com/photo-1612646898898-3eae46bfe1c4?q=80&w=1400&auto=format&fit=crop',
  },
  {
    num: 'II',
    name: 'Sport',
    blurb: 'Integrated bracelets. Engineered for motion.',
    image:
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1400&auto=format&fit=crop',
  },
  {
    num: 'III',
    name: 'Diver',
    blurb: 'Built for depth. Worn on land.',
    image:
      'https://images.unsplash.com/photo-1697731315333-eaa6b7358ffa?q=80&w=1400&auto=format&fit=crop',
  },
  {
    num: 'IV',
    name: 'Chronograph',
    blurb: 'Precision instruments of motorsport heritage.',
    image:
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=1400&auto=format&fit=crop',
  },
];

const ShopByStyle = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.6 * dir, behavior: 'smooth' });
  };

  const arrowBtn = (active: boolean) =>
    `w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
      active
        ? 'border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white'
        : 'border-[var(--border)] text-[var(--muted)]/40 cursor-not-allowed'
    }`;

  return (
    <section className="py-10 md:py-14 bg-[var(--soft)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT — heading + description */}
          <div className="lg:col-span-4 lg:pt-6">
            <span className="eyebrow">Shop by Category</span>
            <h2
              className="font-serif text-[var(--foreground)] mt-2 leading-[1.05]"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              Find your <br className="hidden lg:block" />
              silhouette
            </h2>
            <p className="text-sm text-[var(--muted)] font-light mt-4 max-w-sm leading-relaxed">
              Four enduring characters in watchmaking. Each one a different way to mark time.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 text-[10px] uppercase tracking-[0.4em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 hover:text-primary hover:border-primary transition-colors"
            >
              Browse the collection
            </Link>
          </div>

          {/* RIGHT — carousel of circular tiles */}
          <div className="lg:col-span-8">
            {/* Arrows aligned to the top-right of the carousel */}
            <div className="flex justify-end gap-2 mb-5">
              <button
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous"
                className={arrowBtn(canPrev)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next"
                className={arrowBtn(canNext)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Track */}
            <div
              ref={trackRef}
              className="flex gap-5 md:gap-7 overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory scroll-smooth"
            >
              {CATEGORIES.map((c) => (
                <Link
                  key={c.name}
                  href={`/shop?style=${c.name}`}
                  className="group shrink-0 snap-start flex flex-col items-center text-center w-[60%] sm:w-[42%] lg:w-[34%]"
                >
                  {/* Circular tile */}
                  <div className="relative w-full aspect-square rounded-full overflow-hidden bg-white transition-all duration-500 group-hover:shadow-[0_24px_50px_-16px_rgba(0,0,0,0.25)]">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
                    />

                    {/* Subtle inner ring (always) + gold ring (on hover) */}
                    <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5" />
                    <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-primary/0 group-hover:ring-primary/60 transition-all duration-500" />

                    {/* Dark overlay + huge Roman numeral on hover */}
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                      <span
                        className="font-serif italic text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 leading-none"
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300 }}
                      >
                        {c.num}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <p className="mt-5 font-serif text-lg md:text-xl text-[var(--foreground)] group-hover:text-primary transition-colors leading-none">
                    {c.name}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-[var(--muted)]">
                    No. {c.num}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByStyle;
