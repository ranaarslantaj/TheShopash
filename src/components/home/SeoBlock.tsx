import React from 'react';

const SeoBlock = () => {
  return (
    <section className="py-20 bg-[var(--soft)] border-t border-[var(--border)]">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10">
          <span className="eyebrow">About Shop Ash</span>
          <h2 className="text-2xl md:text-3xl font-serif text-[var(--foreground)] mt-4 leading-snug">
            Pakistan’s Destination for Authenticated Luxury Watches
          </h2>
        </div>

        <div className="prose prose-sm max-w-none text-[var(--muted)] font-light leading-relaxed space-y-4 text-center md:text-left">
          <p>
            Shop Ash is a curated house of the world&apos;s finest timepieces, dedicated to collectors, connoisseurs, and those who understand that a watch is more than an instrument — it is a record of a life well-lived. From the unmistakable authority of a <strong className="text-[var(--foreground)] font-medium">Rolex Day-Date</strong> to the quiet genius of a <strong className="text-[var(--foreground)] font-medium">Patek Philippe Nautilus</strong>, we partner directly with authorised dealers and verified collectors to bring you pieces that carry their own quiet certainty.
          </p>
          <p>
            Every timepiece sold by Shop Ash is authenticated by our master watchmakers, serviced, and documented before it reaches your wrist. We carry the full spectrum of haute horlogerie — <strong className="text-[var(--foreground)] font-medium">Audemars Piguet</strong>, <strong className="text-[var(--foreground)] font-medium">Omega</strong>, <strong className="text-[var(--foreground)] font-medium">Cartier</strong>, <strong className="text-[var(--foreground)] font-medium">Rado</strong>, <strong className="text-[var(--foreground)] font-medium">Tag Heuer</strong>, and <strong className="text-[var(--foreground)] font-medium">Tissot</strong> — from Swiss legends to contemporary innovators.
          </p>
          <p>
            Whether you&apos;re sourcing your first fine watch or adding to a lifetime collection, our concierge team is available around the clock to guide you through the process — from selection to authentication to delivery, insured and hand-couriered worldwide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SeoBlock;
