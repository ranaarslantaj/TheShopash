import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Royal Oak Skeleton',
    pricePKR: 1250000,
    priceUSD: 4500,
    description: 'A masterpiece of horological engineering, featuring a hand-finished skeleton movement and the iconic octagonal bezel.',
    images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop'],
    category: 'Watches',
    stock: 5
  },
  {
    id: '2',
    title: 'Seamaster Heritage',
    pricePKR: 850000,
    priceUSD: 3100,
    description: 'Tribute to the classic diving watches of the 1960s, combining vintage aesthetics with modern ceramic materials.',
    images: ['https://images.unsplash.com/photo-16191341775cf3-68fabb003180?q=80&w=2070&auto=format&fit=crop'],
    category: 'Watches',
    stock: 3
  },
  {
    id: '3',
    title: 'Day-Date Platinum',
    pricePKR: 3500000,
    priceUSD: 12500,
    description: 'The ultimate prestige watch, crafted from solid 950 platinum with the legendary ice-blue dial.',
    images: ['https://images.unsplash.com/photo-1587836374828-4dbaba94cf0e?q=80&w=2070&auto=format&fit=crop'],
    category: 'Watches',
    stock: 2
  },
  {
    id: '4',
    title: 'Nautilus Gold',
    pricePKR: 4200000,
    priceUSD: 15120,
    description: 'Elegant sports watch in 18k rose gold with a sunburst brown dial and horizontal embossing.',
    images: ['https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop'],
    category: 'Watches',
    stock: 1
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-32 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.4em] text-primary mb-4 block font-medium">Curated Selection</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white">Featured Timepieces</h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-[0.3em] text-white/50 hover:text-primary transition-colors border-b border-white/20 pb-2">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
