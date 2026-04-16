'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-32 bg-[#050505] border-t border-white/5">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4 block font-medium">Stay Connected</span>
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Join the Inner Circle</h2>
        <p className="text-white/50 font-light mb-12 leading-relaxed">
          Be the first to discover new collections, exclusive launches, and private offers reserved for our most discerning patrons.
        </p>
        {submitted ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary text-lg font-serif">
            Welcome to the inner circle.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
            />
            <button type="submit" className="luxury-button whitespace-nowrap">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
