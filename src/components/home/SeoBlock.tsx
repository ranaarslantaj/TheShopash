import React from 'react';

const SeoBlock = () => {
  return (
    <section className="py-12 md:py-16 bg-white border-t border-[var(--border)]">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <span className="eyebrow">About Shop Ash</span>
        <h2 className="font-serif text-[var(--foreground)] mt-2 mb-4 leading-snug" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
          Pakistan&apos;s destination for authenticated luxury watches
        </h2>
        <p className="text-[var(--muted)] font-light leading-relaxed text-sm md:text-[15px]">
          Curated timepieces from <span className="text-[var(--foreground)]">Rolex, Patek Philippe, Audemars Piguet, Omega, Rado, Cartier, Tag Heuer</span> and <span className="text-[var(--foreground)]">Tissot</span>. Authenticated by master watchmakers, serviced, documented, and delivered worldwide insured.
        </p>
      </div>
    </section>
  );
};

export default SeoBlock;
