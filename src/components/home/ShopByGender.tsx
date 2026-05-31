import React from 'react';
import Link from 'next/link';

const COLLECTIONS = [
  {
    name: "Men's Watches",
    tag: 'The Gentleman',
    href: '/shop?gender=Men',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
  },
  {
    name: "Women's Watches",
    tag: 'The Icon',
    href: '/shop?gender=Women',
    image: 'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=2080&auto=format&fit=crop',
  },
];

const ShopByGender = () => {
  return (
    <section className="py-8 md:py-12 bg-[var(--soft)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 auto-rows-[420px] md:auto-rows-[500px]">
          {COLLECTIONS.map((col, i) => (
            <Link key={i} href={col.href} className="group relative overflow-hidden block">
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
                <span className="text-[10px] uppercase tracking-[0.5em] text-primary mb-2">{col.tag}</span>
                <h3 className="text-3xl md:text-4xl font-serif mb-4">{col.name}</h3>
                <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em]">
                  Explore
                  <span className="w-8 h-px bg-primary transition-all duration-500 group-hover:w-14" />
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
