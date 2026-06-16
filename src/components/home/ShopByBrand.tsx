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
    <section className="py-14 bg-[radial-gradient(circle_at_top_left,_rgba(245,245,245,0.9),transparent_42%),#f8f8f8]">
      <div className="container mx-auto px-6">
        <div className="mb-10 lg:mb-14">
          <h2
            className="font-serif text-[var(--foreground)] text-[2.75rem] sm:text-[3rem] md:text-[3.5rem] leading-tight font-semibold"
          >
            Shop by Brand
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Link
            href="/shop?brand=Rolex"
            className="relative col-span-1 lg:col-span-5 overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.24)] group"
          >
            <img
              src={BRANDS[0].image}
              alt="Rolex"
              className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-serif text-[2.6rem] leading-none">Rolex</h3>
            </div>
          </Link>

          <div className="col-span-1 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BRANDS.slice(1).map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="relative overflow-hidden rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.16)] group"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-[210px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/60 mb-2">{brand.monogram}</p>
                  <h3 className="font-serif text-2xl leading-tight">{brand.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ShopByBrand;
