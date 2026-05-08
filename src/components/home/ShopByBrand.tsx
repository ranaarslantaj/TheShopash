import React from 'react';
import Link from 'next/link';

const BRANDS = [
  { name: 'Rolex',           image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Patek Philippe',  image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Audemars Piguet', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Omega',           image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Rado',            image: 'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Cartier',         image: 'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Tag Heuer',       image: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Tissot',          image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop' },
];

const ShopByBrand = () => {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">Shop by Brand</span>
          <h2 className="font-serif text-[var(--foreground)] mt-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            The Maisons
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {BRANDS.map((b) => (
            <Link
              key={b.name}
              href={`/shop?brand=${encodeURIComponent(b.name)}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--soft)]">
                <img
                  src={b.image}
                  alt={b.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 ring-1 ring-inset ring-black/5" />
              </div>
              <p className="mt-3 text-center font-serif text-sm md:text-base text-[var(--foreground)] group-hover:text-primary transition-colors">
                {b.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByBrand;
