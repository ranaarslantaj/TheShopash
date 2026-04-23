import React from 'react';
import Link from 'next/link';

const BRANDS = [
  {
    name: 'Rolex',
    tagline: 'A Crown for Every Achievement',
    since: 'Geneva · 1905',
    image:
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Patek Philippe',
    tagline: 'Generations of Artistry',
    since: 'Geneva · 1839',
    image:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Audemars Piguet',
    tagline: 'To Break the Rules',
    since: 'Le Brassus · 1875',
    image:
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Omega',
    tagline: 'Moonshots & Milestones',
    since: 'Biel · 1848',
    image:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Rado',
    tagline: 'Master of Materials',
    since: 'Lengnau · 1917',
    image:
      'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Cartier',
    tagline: 'The Jeweller of Kings',
    since: 'Paris · 1847',
    image:
      'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Tag Heuer',
    tagline: 'Swiss Avant-Garde',
    since: 'La Chaux-de-Fonds · 1860',
    image:
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Tissot',
    tagline: 'Innovators Since 1853',
    since: 'Le Locle · 1853',
    image:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop',
  },
];

const ShopByBrand = () => {
  const [featured, ...rest] = BRANDS;

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-14">
          <div>
            <span className="eyebrow">The Maisons</span>
            <h2 className="section-title mt-4 text-left">Shop by Brand</h2>
            <div className="h-px w-12 bg-primary mt-6" />
          </div>
          <p className="text-[var(--muted)] max-w-md font-light leading-relaxed text-sm">
            Eight houses. Centuries of horological heritage. Each one chosen for the same reason — a legacy worth wearing.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Featured tile — spans 2x2 on large screens */}
          <Link
            href={`/shop?brand=${encodeURIComponent(featured.name)}`}
            className="group relative overflow-hidden col-span-2 row-span-2 aspect-square block bg-[var(--soft)]"
          >
            <img
              src={featured.image}
              alt={featured.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary">Featured Maison</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">{featured.since}</span>
              </div>
              <div className="text-white">
                <h3 className="font-serif text-4xl md:text-6xl mb-3 leading-none">{featured.name}</h3>
                <p className="text-sm md:text-base text-white/80 font-light mb-6 max-w-sm">{featured.tagline}</p>
                <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white">
                  View Collection
                  <span className="w-10 h-px bg-primary transition-all duration-500 group-hover:w-16" />
                </span>
              </div>
            </div>
          </Link>

          {/* Remaining tiles */}
          {rest.map((b) => (
            <Link
              key={b.name}
              href={`/shop?brand=${encodeURIComponent(b.name)}`}
              className="group relative overflow-hidden aspect-square block bg-[var(--soft)]"
            >
              <img
                src={b.image}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Label (default state) */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white transition-transform duration-500 group-hover:translate-y-[-8px]">
                <p className="text-[9px] uppercase tracking-[0.4em] text-primary mb-2">{b.since}</p>
                <h3 className="font-serif text-xl md:text-2xl leading-tight">{b.name}</h3>
                <p className="text-[11px] text-white/70 font-light mt-1 max-h-0 overflow-hidden opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-500">
                  {b.tagline}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-white/80">
                  <span>View Collection</span>
                  <span className="w-6 h-px bg-primary transition-all duration-500 group-hover:w-10" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/shop"
            className="inline-block text-xs uppercase tracking-[0.4em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 hover:text-primary hover:border-primary transition-colors"
          >
            Browse All Maisons
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByBrand;
