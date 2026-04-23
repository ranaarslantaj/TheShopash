'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'The 2026 Novelties',
    title: 'The Art of',
    titleAccent: 'Timeless Horology',
    copy: 'A curated house of the world’s finest timepieces — Rolex, Rado, Patek Philippe, Omega, Cartier and more.',
    cta: 'Explore Collection',
    ctaHref: '/shop',
    secondaryCta: 'The House of Ash',
    secondaryHref: '/about',
    image:
      'https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=2070&auto=format&fit=crop',
    align: 'center' as const,
  },
  {
    eyebrow: 'Signature Rolex',
    title: 'The Crown',
    titleAccent: 'Reimagined',
    copy: 'Platinum, Oystersteel and 18k gold — a collection of the most coveted references from Geneva.',
    cta: 'Shop Rolex',
    ctaHref: '/shop?brand=Rolex',
    secondaryCta: 'Watch Guide',
    secondaryHref: '/about',
    image:
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop',
    align: 'left' as const,
  },
  {
    eyebrow: 'For Her',
    title: 'Poise in',
    titleAccent: 'Mother of Pearl',
    copy: 'Refined proportions, diamond indices, and the quiet luxury of a watch made to be passed down.',
    cta: 'Women’s Collection',
    ctaHref: '/shop?gender=Women',
    secondaryCta: 'Discover Cartier',
    secondaryHref: '/shop?brand=Cartier',
    image:
      'https://images.unsplash.com/photo-1629581678015-fa48ad8441bb?q=80&w=2070&auto=format&fit=crop',
    align: 'right' as const,
  },
];

const Hero = () => {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setIdx((i) => (i + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const go = (delta: number) => {
    setDirection(delta);
    setIdx((i) => (i + delta + SLIDES.length) % SLIDES.length);
  };

  const slide = SLIDES[idx];
  const alignClass =
    slide.align === 'left' ? 'items-start text-left' : slide.align === 'right' ? 'items-end text-right' : 'items-center text-center';

  return (
    <section className="relative h-[92vh] w-full overflow-hidden bg-[var(--soft)]">
      {/* Slide images */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex">
        <div className={`container mx-auto px-6 md:px-12 flex flex-col justify-center w-full ${alignClass}`}>
          <motion.div
            key={`content-${idx}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`max-w-2xl ${slide.align !== 'center' ? '' : 'mx-auto'}`}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-primary mb-6 block font-medium">
              {slide.eyebrow}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[0.95]">
              {slide.title} <br />
              <span className="luxury-text-gradient">{slide.titleAccent}</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl mb-10 font-light leading-relaxed">
              {slide.copy}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 ${slide.align === 'center' ? 'justify-center' : slide.align === 'right' ? 'justify-end' : ''}`}>
              <Link href={slide.ctaHref} className="bg-white text-[var(--foreground)] px-8 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-primary hover:text-white transition-colors">
                {slide.cta}
              </Link>
              <Link href={slide.secondaryHref} className="border border-white/60 text-white px-8 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-white hover:text-[var(--foreground)] transition-colors">
                {slide.secondaryCta}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 text-white/70 hover:text-white transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 text-white/70 hover:text-white transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots + slide counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > idx ? 1 : -1);
              setIdx(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-px transition-all duration-500 ${
              i === idx ? 'w-16 bg-white' : 'w-8 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-20 text-white/70 text-[10px] uppercase tracking-[0.4em] hidden md:block">
        {String(idx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </section>
  );
};

export default Hero;
