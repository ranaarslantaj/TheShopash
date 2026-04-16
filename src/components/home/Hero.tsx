'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Watch" 
          className="w-full h-full object-cover scale-105"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.5em] text-primary mb-6 block font-medium"
        >
          Established 2024
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight"
        >
          The Art of <br /> 
          <span className="luxury-text-gradient">Timeless Elegance</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Discover our exclusive collection of premium watches crafted for those who appreciate the finer things in life.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Link href="/shop" className="luxury-button w-full md:w-auto text-center px-12">
            Explore Collection
          </Link>
          <Link href="/about" className="luxury-outline-button w-full md:w-auto text-center px-12">
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Down Arrow Animation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-20 bg-gradient-to-b from-primary/0 via-primary to-primary/0 mx-auto"
        />
      </div>
    </section>
  );
};

export default Hero;
