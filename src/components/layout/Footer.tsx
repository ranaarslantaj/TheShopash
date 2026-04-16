import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

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
            <Instagram className="w-5 h-5 text-white/70 hover:text-primary cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 text-white/70 hover:text-primary cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-white/70 hover:text-primary cursor-pointer transition-colors" />
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
