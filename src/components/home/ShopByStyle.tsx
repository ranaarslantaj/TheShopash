import React from 'react';
import Link from 'next/link';

const STYLES = [
  { name: 'Dress',       image: 'https://images.unsplash.com/photo-1612646898898-3eae46bfe1c4?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Sport',       image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Diver',       image: 'https://images.unsplash.com/photo-1697731315333-eaa6b7358ffa?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Chronograph', image: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=1200&auto=format&fit=crop' },
];

const ShopByStyle = () => {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">Shop by Style</span>
          <h2 className="font-serif text-[var(--foreground)] mt-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            Find Your Silhouette
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {STYLES.map((s) => (
            <Link
              key={s.name}
              href={`/shop?style=${s.name}`}
              className="group relative overflow-hidden aspect-[4/5] block"
            >
              <img
                src={s.image}
                alt={s.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="text-xl md:text-2xl font-serif">{s.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em]">
                  <span>Shop</span>
                  <span className="w-5 h-px bg-primary transition-all duration-500 group-hover:w-10" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByStyle;
