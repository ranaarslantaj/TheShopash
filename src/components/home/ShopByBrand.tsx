import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BrandTile {
  name: string;
  href: string;
  image: string;
  /** Three-letter monogram shown subtly behind the name on hover */
  monogram?: string;
}

const BRANDS: BrandTile[] = [
  {
    name: 'Rolex',
    href: '/shop?brand=Rolex',
    image:
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=1400&auto=format&fit=crop',
    monogram: 'RLX',
  },
  {
    name: 'Tomi',
    href: '/shop?brand=Tomi',
    image:
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=1400&auto=format&fit=crop',
    monogram: 'TMI',
  },
  {
    name: 'Tissot',
    href: '/shop?brand=Tissot',
    image:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1400&auto=format&fit=crop',
    monogram: 'TSO',
  },
  {
    name: 'Cartier',
    href: '/shop?brand=Cartier',
    image:
      'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=1400&auto=format&fit=crop',
    monogram: 'CRT',
  },
  {
    name: 'Casio',
    href: '/shop?brand=Casio',
    image:
      'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=1400&auto=format&fit=crop',
    monogram: 'CSO',
  },
  {
    name: 'Seiko',
    href: '/shop?brand=Seiko',
    image:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1400&auto=format&fit=crop',
    monogram: 'SKO',
  },
  {
    name: 'Other Brands',
    href: '/shop',
    image:
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=1400&auto=format&fit=crop',
    monogram: '+',
  },
];

const ShopByBrand = () => {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8 md:mb-12">
          <div>
            <span className="eyebrow">The Maisons</span>
            <h2
              className="font-serif text-[var(--foreground)] mt-2"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              Shop by Brand
            </h2>
          </div>
          <p className="text-sm text-[var(--muted)] max-w-sm">
            Seven houses, one curated catalogue.
          </p>
        </div>

        {/* 4×2 grid: 7 brand tiles + 1 catalogue CTA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {BRANDS.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className="group relative aspect-square overflow-hidden bg-[var(--soft)]"
            >
              {/* Image */}
              <img
                src={b.image}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />

              {/* Dark gradient overlay — top to bottom, lifts on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 transition-opacity duration-500 group-hover:opacity-90" />

              {/* Faint monogram (only visible on hover) */}
              {b.monogram && (
                <span
                  className="absolute inset-0 flex items-center justify-center font-serif text-white/0 group-hover:text-white/[0.06] transition-colors duration-700 pointer-events-none select-none"
                  style={{ fontSize: 'clamp(6rem, 14vw, 12rem)', fontWeight: 300, letterSpacing: '0.05em' }}
                >
                  {b.monogram}
                </span>
              )}

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white">
                <h3
                  className="font-serif leading-none tracking-tight"
                  style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)', fontWeight: 300 }}
                >
                  {b.name}
                </h3>

                {/* Animated underline + label */}
                <div className="flex items-center gap-3 mt-3 md:mt-4">
                  <span className="block h-px w-6 bg-primary transition-all duration-500 group-hover:w-12" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] opacity-80 group-hover:opacity-100 transition-opacity">
                    Explore
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* 8th tile: full-catalogue CTA — pure typographic, no image */}
          <Link
            href="/shop"
            className="group relative aspect-square overflow-hidden bg-[var(--foreground)] text-white flex flex-col items-center justify-center text-center p-6"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-primary mb-3">
              All Timepieces
            </span>
            <h3
              className="font-serif leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', fontWeight: 300 }}
            >
              View Full
              <br />
              Catalogue
            </h3>
            <div className="flex items-center gap-2 mt-5 text-[10px] uppercase tracking-[0.4em] text-white/80">
              <span>Browse</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </div>
            <span className="absolute inset-0 ring-1 ring-inset ring-primary/0 group-hover:ring-primary/40 transition-colors duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByBrand;
