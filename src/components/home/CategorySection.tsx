import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    name: 'Watches',
    href: '/shop?category=watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
    span: 'md:col-span-2'
  },
  {
    name: 'Clothes',
    href: '/shop?category=clothes',
    image: 'https://images.unsplash.com/photo-1594932224010-74f43a183543?q=80&w=2080&auto=format&fit=crop',
    span: 'md:col-span-1'
  },
  {
    name: 'Perfumes',
    href: '/shop?category=perfumes',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1964&auto=format&fit=crop',
    span: 'md:col-span-1'
  },
  {
    name: 'Accessories',
    href: '/shop?category=accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974&auto=format&fit=crop',
    span: 'md:col-span-2'
  }
];

const CategorySection = () => {
  return (
    <section id="collections" className="py-32 bg-[#050505]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4 block font-medium">Classics & Beyond</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white">Explore Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {CATEGORIES.map((cat, index) => (
            <Link 
              key={index}
              href={cat.href}
              className={`group relative overflow-hidden ${cat.span}`}
            >
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 transition-transform duration-500 group-hover:-translate-y-2">{cat.name}</h3>
                <div className="w-12 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                <span className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
