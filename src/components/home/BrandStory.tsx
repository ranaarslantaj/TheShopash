import React from 'react';
import { motion } from 'framer-motion';

const BrandStory = () => {
  return (
    <section className="py-32 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?q=80&w=1968&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square bg-[#111] -z-10" />
            <div className="absolute top-1/2 -left-20 -translate-y-1/2 text-[200px] font-serif transition-colors text-white/5 select-none pointer-events-none hidden xl:block">
              ASH
            </div>
          </div>

          <div className="space-y-8">
            <span className="text-xs uppercase tracking-[0.5em] text-primary font-medium">Our Identity</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
              A Legacy in <br /> Modern Craftsmanship
            </h2>
            <div className="space-y-6 text-white/50 font-light leading-relaxed">
              <p>
                Founded on the principles of uncompromising quality and timeless design, Shop Ash represents a new era of luxury. We don't just sell products; we curate experiences for those who value the artistry behind every detail.
              </p>
              <p>
                From the intricate mechanical movements of our premium watches to the supple leather of our accessories, every piece in our collection is a testament to our commitment to excellence.
              </p>
            </div>
            <div className="pt-8">
              <div className="flex items-center space-x-12">
                <div>
                  <h4 className="text-3xl font-serif text-white mb-1">100%</h4>
                  <p className="text-[10px] uppercase tracking-widest text-primary">Authentic</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif text-white mb-1">Global</h4>
                  <p className="text-[10px] uppercase tracking-widest text-primary">Shipping</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif text-white mb-1">24/7</h4>
                  <p className="text-[10px] uppercase tracking-widest text-primary">Concierge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
