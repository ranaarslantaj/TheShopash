'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface FeaturedPiece {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
}

interface Slide {
  eyebrow: string;
  serial: string;
  title: string;
  copy: string;
  cta: string;
  ctaHref: string;
  image: string;
  piece?: FeaturedPiece;
}

const SLIDES: Slide[] = [
  {
    serial: '01',
    eyebrow: 'The 2026 Novelties',
    title: 'The Art of\nTimeless Horology',
    copy: 'A curated house of the world’s finest timepieces — for those who measure time in legacy.',
    cta: 'Shop the Collection',
    ctaHref: '/shop',
    image:
      'https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=2400&auto=format&fit=crop',
    piece: {
      id: '4',
      brand: 'Patek Philippe',
      name: 'Nautilus Rose Gold',
      price: 'PKR 4,200,000',
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop',
    },
  },
  {
    serial: '02',
    eyebrow: 'Crown Jewels',
    title: 'Rolex,\nReimagined',
    copy: 'Platinum, Oystersteel and 18k gold — references that have shaped the modern wrist.',
    cta: 'Shop Rolex',
    ctaHref: '/shop?brand=Rolex',
    image:
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2400&auto=format&fit=crop',
    piece: {
      id: '3',
      brand: 'Rolex',
      name: 'Day-Date Platinum',
      price: 'PKR 3,500,000',
      image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=600&auto=format&fit=crop',
    },
  },
  {
    serial: '03',
    eyebrow: 'For Her',
    title: 'Poise in\nMother of Pearl',
    copy: 'Diamond indices, refined proportions, and silhouettes designed to be passed down.',
    cta: "Shop Women's",
    ctaHref: '/shop?gender=Women',
    image:
      'https://images.unsplash.com/photo-1629581678015-fa48ad8441bb?q=80&w=2400&auto=format&fit=crop',
    piece: {
      id: '9',
      brand: 'Rolex',
      name: 'Datejust 31 Mother of Pearl',
      price: 'PKR 2,100,000',
      image: 'https://images.unsplash.com/photo-1629581678015-fa48ad8441bb?q=80&w=600&auto=format&fit=crop',
    },
  },
];

const Hero = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, [paused]);

  const go = (delta: number) => setIdx((i) => (i + delta + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[idx];

  return (
    <section
      className="relative w-full bg-[var(--soft)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden h-[88vh] md:h-[90vh] min-h-[640px] max-h-[880px]">
        {/* Background image with Ken Burns */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.01 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 7.5, ease: 'linear' },
            }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic gradient — heavier on the left where text lives */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/0" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        {/* CONTENT */}
        <div className="relative z-10 h-full container mx-auto px-6 md:px-12 grid grid-cols-12 gap-6 items-end pb-24 md:pb-28">
          <motion.div
            key={`c-${idx}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-7 xl:col-span-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="font-serif italic text-white/60 text-lg numeral">{slide.serial}</span>
              <span className="block w-12 h-px bg-primary" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/85">{slide.eyebrow}</p>
            </div>

            <h1
              className="font-serif text-white leading-[0.96] mb-7 whitespace-pre-line"
              style={{ fontSize: 'clamp(3rem, 6.4vw, 6rem)', fontWeight: 300 }}
            >
              {slide.title}
            </h1>

            <p className="text-white/80 max-w-lg mb-10 font-light leading-relaxed text-[15px] md:text-[17px]">
              {slide.copy}
            </p>

            <div className="flex items-center gap-6 flex-wrap">
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center justify-center bg-white text-[var(--foreground)] px-10 py-4 text-[11px] uppercase tracking-[0.4em] font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                {slide.cta}
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-white text-[11px] uppercase tracking-[0.4em] hover:text-primary transition-colors"
              >
                Our Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Featured piece card — bottom right */}
          {slide.piece && (
            <motion.div
              key={`p-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:col-start-8 xl:col-start-9 justify-self-end"
            >
              <Link
                href={`/product/${slide.piece.id}`}
                className="group flex items-center gap-4 bg-white/8 backdrop-blur-md border border-white/15 p-3 pr-6 hover:bg-white/15 hover:border-white/25 transition-all max-w-[340px]"
              >
                <div className="w-20 h-24 shrink-0 overflow-hidden">
                  <img
                    src={slide.piece.image}
                    alt={slide.piece.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-primary mb-1">Featured Piece</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/65 mb-0.5">
                    {slide.piece.brand}
                  </p>
                  <p className="font-serif text-white text-base leading-tight truncate group-hover:text-primary transition-colors">
                    {slide.piece.name}
                  </p>
                  <p className="text-xs text-white/85 mt-1.5 tabular-nums">{slide.piece.price}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-7 h-7" strokeWidth={1.2} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronRight className="w-7 h-7" strokeWidth={1.2} />
        </button>

        {/* Slide pagination — bottom center */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}: ${s.eyebrow}`}
              className="group flex items-center"
            >
              <span
                className={`block h-[2px] transition-all duration-500 ${
                  i === idx ? 'w-12 bg-white' : 'w-6 bg-white/35 group-hover:bg-white/65'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Slide counter — bottom right */}
        <div className="absolute bottom-7 right-6 md:right-12 z-20 hidden md:flex items-baseline gap-2 text-white">
          <span className="font-serif italic text-xl tabular-nums">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span className="text-white/40 text-xs">/</span>
          <span className="text-white/60 text-sm tabular-nums">
            {String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
