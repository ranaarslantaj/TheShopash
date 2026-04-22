import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <h3 className="text-2xl font-serif luxury-text-gradient tracking-widest">SHOP ASH</h3>
          <p className="text-sm text-white/50 leading-relaxed font-light">
            Crafting elegance and defining luxury for the modern world. Our collection represents the pinnacle of craftsmanship and style.
          </p>
          <div className="flex space-x-4">
            <svg className="w-5 h-5 text-white/70 hover:text-primary cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <svg className="w-5 h-5 text-white/70 hover:text-primary cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            <svg className="w-5 h-5 text-white/70 hover:text-primary cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-white uppercase tracking-widest text-sm font-semibold">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link href="/shop" className="text-sm text-white/50 hover:text-primary transition-colors">All Products</Link></li>
            <li><Link href="/#collections" className="text-sm text-white/50 hover:text-primary transition-colors">Collections</Link></li>
            <li><Link href="/about" className="text-sm text-white/50 hover:text-primary transition-colors">Our Story</Link></li>
            <li><Link href="/contact" className="text-sm text-white/50 hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          <h4 className="text-white uppercase tracking-widest text-sm font-semibold">Categories</h4>
          <ul className="space-y-4">
            <li><Link href="/shop?category=watches" className="text-sm text-white/50 hover:text-primary transition-colors">Premium Watches</Link></li>
            <li><Link href="/shop?category=clothes" className="text-sm text-white/50 hover:text-primary transition-colors">Designer Wear</Link></li>
            <li><Link href="/shop?category=perfumes" className="text-sm text-white/50 hover:text-primary transition-colors">Fine Fragrances</Link></li>
            <li><Link href="/shop?category=accessories" className="text-sm text-white/50 hover:text-primary transition-colors">Accessories</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-white uppercase tracking-widest text-sm font-semibold">Contact Info</h4>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-sm text-white/50">
              <Phone className="w-4 h-4 text-primary" />
              <span>+92 300 1234567</span>
            </li>
            <li className="flex items-center space-x-3 text-sm text-white/50">
              <Mail className="w-4 h-4 text-primary" />
              <span>concierge@shopash.com</span>
            </li>
            <li className="flex items-center space-x-3 text-sm text-white/50">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Luxury Avenue, Karachi, Pakistan</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] uppercase tracking-widest text-white/30">
        <p>© 2026 Shop Ash. All rights reserved.</p>
        <div className="flex space-x-8">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
