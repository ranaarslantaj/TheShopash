import React from 'react';
import Link from 'next/link';

const ARTICLES = [
  {
    category: 'The Journal',
    title: 'The Rolex Day-Date, Decoded',
    copy: 'A 70-year history of the President. Materials, references, and what to look for when buying.',
    image:
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    category: 'Investment',
    title: 'Why the Nautilus Still Commands a Waiting List',
    copy: 'Gerald Genta’s integrated bracelet masterpiece, and the case for Patek as a collector’s investment.',
    image:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop',
  },
  {
    category: 'Craft',
    title: 'The Art of High-Tech Ceramic',
    copy: 'How Rado redefined the materials of modern horology — and why your next watch might be ceramic.',
    image:
      'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=1200&auto=format&fit=crop',
  },
];

const EditorialRow = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <span className="eyebrow">The Journal</span>
            <h2 className="section-title mt-4 text-left">Stories from the Maison</h2>
          </div>
          <Link
            href="/about"
            className="text-xs uppercase tracking-[0.4em] text-[var(--muted)] hover:text-primary transition-colors border-b border-[var(--border)] pb-2"
          >
            Read All Stories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((a, i) => (
            <article key={i} className="group cursor-pointer">
              <div className="aspect-[4/5] overflow-hidden mb-6">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">{a.category}</p>
              <h3 className="text-2xl font-serif text-[var(--foreground)] mb-3 leading-tight group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              <p className="text-sm text-[var(--muted)] font-light leading-relaxed">{a.copy}</p>
              <span className="inline-block mt-5 text-[10px] uppercase tracking-[0.4em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 group-hover:text-primary group-hover:border-primary transition-colors">
                Continue Reading
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialRow;
