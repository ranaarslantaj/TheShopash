import React from 'react';

const STATS = [
  { number: '08', label: 'Swiss Maisons' },
  { number: '100%', label: 'Authenticated' },
  { number: '24/7', label: 'Concierge Support' },
  { number: '∞', label: 'Lifetime Service' },
];

const StatsStrip = () => {
  return (
    <section className="relative py-14 md:py-20 bg-[var(--foreground)] text-white overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.08]">
        <img
          src="https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-primary mb-3 block font-medium">Our Commitment</span>
          <h2 className="text-2xl md:text-3xl font-serif leading-tight">
            Built on <span className="luxury-text-gradient">Uncompromising Standards</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center md:border-r md:border-white/10 md:last:border-r-0 py-4"
            >
              <p className="text-4xl md:text-5xl font-serif text-white mb-2 luxury-text-gradient">
                {s.number}
              </p>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
