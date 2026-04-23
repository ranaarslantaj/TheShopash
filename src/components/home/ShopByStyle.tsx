import React from 'react';
import Link from 'next/link';

const STYLES = [
  {
    name: 'Dress',
    copy: 'Refined slimness for the boardroom and beyond',
    image:
      'https://images.unsplash.com/photo-1612646898898-3eae46bfe1c4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Sport',
    copy: 'Integrated bracelets, engineered for the adventurous',
    image:
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Diver',
    copy: 'Built for the deep, worn on land',
    image:
      'https://images.unsplash.com/photo-1697731315333-eaa6b7358ffa?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Chronograph',
    copy: 'Precision instruments of motorsport heritage',
    image:
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=1200&auto=format&fit=crop',
  },
];

const ShopByStyle = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="eyebrow">Curated by Character</span>
          <h2 className="section-title mt-4">Shop by Style</h2>
          <div className="divider-gold" />
          <p className="text-[var(--muted)] max-w-2xl mx-auto font-light leading-relaxed">
            Every wrist tells a story. Find the silhouette that tells yours.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STYLES.map((s) => (
            <Link
              key={s.name}
              href={`/shop?style=${s.name}`}
              className="group relative overflow-hidden aspect-[4/5] block"
            >
              <img
                src={s.image}
                alt={s.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-serif mb-2">{s.name}</h3>
                <p className="text-[11px] md:text-xs text-white/75 font-light max-w-[220px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {s.copy}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em]">
                  <span>Shop</span>
                  <span className="w-6 h-px bg-primary transition-all duration-500 group-hover:w-12" />
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
