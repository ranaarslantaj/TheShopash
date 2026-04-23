import React from 'react';
import Link from 'next/link';

const COLLECTIONS = [
  {
    name: "Men's Watches",
    tag: 'The Gentleman',
    copy: 'Dress, sport, diver, chronograph — for the man who marks time with intention.',
    href: '/shop?gender=Men',
    image:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
  },
  {
    name: "Women's Watches",
    tag: 'The Icon',
    copy: 'Mother of pearl, diamond indices, and silhouettes that become heirlooms.',
    href: '/shop?gender=Women',
    image:
      'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=2080&auto=format&fit=crop',
  },
];

const ShopByGender = () => {
  return (
    <section className="py-24 md:py-32 bg-[var(--soft)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="eyebrow">Shop by Gender</span>
          <h2 className="section-title mt-4">For Him. For Her.</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 auto-rows-[500px] md:auto-rows-[580px]">
          {COLLECTIONS.map((col, i) => (
            <Link key={i} href={col.href} className="group relative overflow-hidden block">
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14 text-white">
                <span className="text-[10px] uppercase tracking-[0.5em] text-primary mb-3">{col.tag}</span>
                <h3 className="text-4xl md:text-5xl font-serif mb-4">{col.name}</h3>
                <p className="text-white/75 font-light max-w-md mb-6 leading-relaxed">{col.copy}</p>
                <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em]">
                  Explore Collection
                  <span className="w-10 h-px bg-primary transition-all duration-500 group-hover:w-16" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByGender;
