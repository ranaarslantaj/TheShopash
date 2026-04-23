import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const YoutubeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[var(--foreground)] text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Top - Brand and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-serif luxury-text-gradient tracking-[0.3em]">SHOP ASH</h3>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-sm">
              A curated house of the world&apos;s finest timepieces. Authenticated, serviced, and delivered worldwide with the reverence the craft demands.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/70 hover:bg-primary hover:border-primary hover:text-white transition-colors" aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/70 hover:bg-primary hover:border-primary hover:text-white transition-colors" aria-label="Facebook">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/70 hover:bg-primary hover:border-primary hover:text-white transition-colors" aria-label="YouTube">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4">Join the Inner Circle</p>
            <h4 className="text-2xl md:text-3xl font-serif mb-6 leading-tight">
              Be the first to know about new arrivals, rare pieces, and private previews.
            </h4>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent border-b border-white/30 px-2 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-[var(--foreground)] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Middle - Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-16 border-b border-white/10">
          <div className="space-y-5">
            <h5 className="text-[10px] uppercase tracking-[0.4em] text-primary">Shop</h5>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-sm text-white/70 hover:text-primary transition-colors">All Watches</Link></li>
              <li><Link href="/shop?tag=new" className="text-sm text-white/70 hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?gender=Men" className="text-sm text-white/70 hover:text-primary transition-colors">Men&apos;s Watches</Link></li>
              <li><Link href="/shop?gender=Women" className="text-sm text-white/70 hover:text-primary transition-colors">Women&apos;s Watches</Link></li>
              <li><Link href="/shop?tag=bestseller" className="text-sm text-white/70 hover:text-primary transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h5 className="text-[10px] uppercase tracking-[0.4em] text-primary">The Maisons</h5>
            <ul className="space-y-3">
              <li><Link href="/shop?brand=Rolex" className="text-sm text-white/70 hover:text-primary transition-colors">Rolex</Link></li>
              <li><Link href="/shop?brand=Patek%20Philippe" className="text-sm text-white/70 hover:text-primary transition-colors">Patek Philippe</Link></li>
              <li><Link href="/shop?brand=Audemars%20Piguet" className="text-sm text-white/70 hover:text-primary transition-colors">Audemars Piguet</Link></li>
              <li><Link href="/shop?brand=Omega" className="text-sm text-white/70 hover:text-primary transition-colors">Omega</Link></li>
              <li><Link href="/shop?brand=Rado" className="text-sm text-white/70 hover:text-primary transition-colors">Rado</Link></li>
              <li><Link href="/shop?brand=Cartier" className="text-sm text-white/70 hover:text-primary transition-colors">Cartier</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h5 className="text-[10px] uppercase tracking-[0.4em] text-primary">Services</h5>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Concierge</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Authentication</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Servicing</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Bespoke Sourcing</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Pre-Owned</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h5 className="text-[10px] uppercase tracking-[0.4em] text-primary">Maison</h5>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-white/70 hover:text-primary transition-colors">Heritage</Link></li>
              <li><Link href="/about" className="text-sm text-white/70 hover:text-primary transition-colors">The Journal</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Boutique</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-primary transition-colors">Press</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h5 className="text-[10px] uppercase tracking-[0.4em] text-primary">Contact</h5>
            <ul className="space-y-4 text-sm text-white/70 font-light">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>concierge@shopash.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Luxury Avenue, Karachi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom - Legal + Payments */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Returns</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Shipping</Link>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            © 2026 Shop Ash · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
