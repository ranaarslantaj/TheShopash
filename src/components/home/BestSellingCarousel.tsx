'use client';

import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/products';
import { Product } from '@/context/CartContext';

const BEST_SELLER_LIMIT = 8;

const bestSellers: Product[] = MOCK_PRODUCTS.filter((product) =>
  product.tags?.includes('bestseller')
).slice(0, BEST_SELLER_LIMIT);

const displayProducts = bestSellers.length > 0 ? bestSellers : MOCK_PRODUCTS.slice(0, BEST_SELLER_LIMIT);
const marqueeProducts = [...displayProducts, ...displayProducts];

const BestSellingCarousel = () => {
  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--soft)]">
          <div className="carousel-track flex items-center gap-3 py-5 px-3">
            {marqueeProducts.map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                href={`/product/${product.id}`}
                className="group block min-w-[200px] sm:min-w-[220px] lg:min-w-[240px] h-[220px] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.08)] bg-black"
              >
                <div className="relative h-full w-full">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .carousel-track {
          animation: marquee 28s linear infinite;
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default BestSellingCarousel;
