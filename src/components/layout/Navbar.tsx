'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, User, Search, ChevronDown, Package, LogOut, ClipboardList } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from './AnnouncementBar';

const BRANDS = [
  { name: 'Rolex', tagline: 'A Crown for Every Achievement' },
  { name: 'Patek Philippe', tagline: 'Generations of Artistry' },
  { name: 'Audemars Piguet', tagline: 'To Break the Rules' },
  { name: 'Omega', tagline: 'Moonshots & Milestones' },
  { name: 'Rado', tagline: 'Master of Materials' },
  { name: 'Cartier', tagline: 'The Jeweller of Kings' },
  { name: 'Tag Heuer', tagline: 'Swiss Avant-Garde' },
  { name: 'Tissot', tagline: 'Innovators Since 1853' },
];

const GENDER_LINKS = [
  { label: 'All Men’s Watches', href: '/shop?gender=Men' },
  { label: 'Dress', href: '/shop?gender=Men&style=Dress' },
  { label: 'Sport', href: '/shop?gender=Men&style=Sport' },
  { label: 'Diver', href: '/shop?gender=Men&style=Diver' },
  { label: 'Chronograph', href: '/shop?gender=Men&style=Chronograph' },
];

const WOMEN_LINKS = [
  { label: 'All Women’s Watches', href: '/shop?gender=Women' },
  { label: 'Dress', href: '/shop?gender=Women&style=Dress' },
  { label: 'Jewellery Watches', href: '/shop?gender=Women' },
  { label: 'Diamond Dials', href: '/shop?gender=Women' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | 'men' | 'women' | 'brands'>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const { cartCount, openDrawer } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSignOut = async () => {
    setAccountOpen(false);
    await signOut();
  };

  const userInitial = user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '';

  return (
    <>
      <AnnouncementBar />

      <nav
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 bg-white ${
          isScrolled ? 'border-b border-[var(--border)] shadow-sm' : 'border-b border-transparent'
        }`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        {/* Top utility row */}
        <div className="container mx-auto px-6 flex justify-between items-center py-4 lg:py-5">
          <button
            className="lg:hidden text-[var(--foreground)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden lg:flex items-center gap-6 flex-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <Link
              href="/track"
              className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
            >
              Track Order
            </Link>
            <Link
              href="/contact"
              className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
            >
              Concierge
            </Link>
          </div>

          <Link href="/" className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-serif tracking-[0.3em] luxury-text-gradient font-light">
              SHOP ASH
            </span>
            <span className="hidden md:block text-[9px] uppercase tracking-[0.5em] text-[var(--muted)] mt-1">
              Maison de Horlogerie
            </span>
          </Link>

          <div className="flex items-center gap-4 lg:gap-6 flex-1 justify-end">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden text-[var(--foreground)]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
                aria-label="Account"
              >
                {user ? (
                  <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                    {userInitial}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-[var(--foreground)]" />
                )}
                <span className="hidden lg:inline">{user ? 'Account' : 'Sign In'}</span>
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-72 bg-white border border-[var(--border)] shadow-xl z-50"
                  >
                    {user ? (
                      <div>
                        <div className="px-5 py-4 border-b border-[var(--border)]">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Signed in as</p>
                          <p className="font-serif text-base text-[var(--foreground)] mt-1 truncate">
                            {user.displayName || user.email}
                          </p>
                          {user.displayName && (
                            <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{user.email}</p>
                          )}
                        </div>
                        <div className="py-2">
                          <Link
                            href="/account"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--soft)] transition-colors"
                          >
                            <User className="w-4 h-4 text-[var(--muted)]" />
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--soft)] transition-colors"
                          >
                            <Package className="w-4 h-4 text-[var(--muted)]" />
                            My Orders
                          </Link>
                          <Link
                            href="/track"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--soft)] transition-colors"
                          >
                            <ClipboardList className="w-4 h-4 text-[var(--muted)]" />
                            Track an Order
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--soft)] transition-colors w-full text-left border-t border-[var(--border)] mt-2 pt-3"
                          >
                            <LogOut className="w-4 h-4 text-[var(--muted)]" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 space-y-4">
                        <p className="text-sm text-[var(--muted)] font-light leading-relaxed">
                          Sign in to view your orders, manage your account, and unlock private previews.
                        </p>
                        <Link
                          href="/account/login"
                          onClick={() => setAccountOpen(false)}
                          className="block w-full text-center bg-[var(--foreground)] text-white px-5 py-3 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/account/signup"
                          onClick={() => setAccountOpen(false)}
                          className="block w-full text-center border border-[var(--foreground)] text-[var(--foreground)] px-5 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[var(--foreground)] hover:text-white transition-colors"
                        >
                          Create Account
                        </Link>
                        <div className="pt-3 border-t border-[var(--border)]">
                          <Link
                            href="/track"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-primary transition-colors"
                          >
                            <ClipboardList className="w-4 h-4" />
                            Track an order without signing in
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={openDrawer}
              className="relative group"
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-[var(--foreground)] group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main nav row (desktop) */}
        <div className="hidden lg:block border-t border-[var(--border)]">
          <div className="container mx-auto px-6">
            <ul className="flex justify-center items-center gap-10 py-4">
              <li>
                <Link href="/shop?tag=new" className="text-xs uppercase tracking-[0.3em] text-[var(--foreground)] hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li className="relative" onMouseEnter={() => setOpenMenu('men')}>
                <button className="flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-[var(--foreground)] hover:text-primary transition-colors">
                  Men <ChevronDown className="w-3 h-3" />
                </button>
              </li>
              <li className="relative" onMouseEnter={() => setOpenMenu('women')}>
                <button className="flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-[var(--foreground)] hover:text-primary transition-colors">
                  Women <ChevronDown className="w-3 h-3" />
                </button>
              </li>
              <li className="relative" onMouseEnter={() => setOpenMenu('brands')}>
                <button className="flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-[var(--foreground)] hover:text-primary transition-colors">
                  Brands <ChevronDown className="w-3 h-3" />
                </button>
              </li>
              <li onMouseEnter={() => setOpenMenu(null)}>
                <Link href="/shop" className="text-xs uppercase tracking-[0.3em] text-[var(--foreground)] hover:text-primary transition-colors">
                  The Collection
                </Link>
              </li>
              <li onMouseEnter={() => setOpenMenu(null)}>
                <Link href="/about" className="text-xs uppercase tracking-[0.3em] text-[var(--foreground)] hover:text-primary transition-colors">
                  Heritage
                </Link>
              </li>
              <li onMouseEnter={() => setOpenMenu(null)}>
                <Link href="/contact" className="text-xs uppercase tracking-[0.3em] text-[var(--foreground)] hover:text-primary transition-colors">
                  Boutique
                </Link>
              </li>
            </ul>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {openMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full bg-white border-t border-[var(--border)] shadow-xl"
              >
                <div className="container mx-auto px-6 py-10">
                  {openMenu === 'brands' && (
                    <div className="grid grid-cols-4 gap-8">
                      {BRANDS.map((b) => (
                        <Link
                          key={b.name}
                          href={`/shop?brand=${encodeURIComponent(b.name)}`}
                          className="group"
                          onClick={() => setOpenMenu(null)}
                        >
                          <p className="font-serif text-lg text-[var(--foreground)] group-hover:text-primary transition-colors">
                            {b.name}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mt-1">
                            {b.tagline}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  {openMenu === 'men' && (
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="eyebrow">Shop by Style</p>
                        {GENDER_LINKS.map((l) => (
                          <Link
                            key={l.label}
                            href={l.href}
                            onClick={() => setOpenMenu(null)}
                            className="block text-sm text-[var(--foreground)]/80 hover:text-primary transition-colors"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                      <Link href="/shop?gender=Men" onClick={() => setOpenMenu(null)} className="block aspect-[3/2] relative overflow-hidden group">
                        <img
                          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
                          alt="Men's Watches"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-end p-6">
                          <div className="text-white">
                            <p className="font-serif text-2xl">For Him</p>
                            <p className="text-[10px] uppercase tracking-[0.3em] mt-1">Explore the collection →</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  {openMenu === 'women' && (
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="eyebrow">Shop by Style</p>
                        {WOMEN_LINKS.map((l) => (
                          <Link
                            key={l.label}
                            href={l.href}
                            onClick={() => setOpenMenu(null)}
                            className="block text-sm text-[var(--foreground)]/80 hover:text-primary transition-colors"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                      <Link href="/shop?gender=Women" onClick={() => setOpenMenu(null)} className="block aspect-[3/2] relative overflow-hidden group">
                        <img
                          src="https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=2080&auto=format&fit=crop"
                          alt="Women's Watches"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-end p-6">
                          <div className="text-white">
                            <p className="font-serif text-2xl">For Her</p>
                            <p className="text-[10px] uppercase tracking-[0.3em] mt-1">Explore the collection →</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[var(--border)] bg-white overflow-hidden"
            >
              <div className="container mx-auto px-6 py-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-4 border-b border-[var(--foreground)] pb-3"
                >
                  <Search className="w-5 h-5 text-[var(--muted)]" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for a Rolex, Patek, Rado…"
                    className="flex-1 bg-transparent text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mr-3">Popular:</span>
                  {['Rolex Day-Date', 'Patek Nautilus', 'Rado Ceramic', 'Omega Seamaster'].map((s) => (
                    <Link
                      key={s}
                      href={`/shop`}
                      onClick={() => setSearchOpen(false)}
                      className="text-xs text-[var(--foreground)]/70 hover:text-primary"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[60] bg-white overflow-y-auto"
          >
            <div className="p-6 flex justify-between items-center border-b border-[var(--border)]">
              <span className="text-xl font-serif tracking-[0.3em] luxury-text-gradient">SHOP ASH</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X />
              </button>
            </div>
            <div className="p-6 space-y-8">
              <div className="space-y-3">
                <p className="eyebrow">Navigate</p>
                <Link href="/shop?tag=new" onClick={() => setIsMobileMenuOpen(false)} className="block font-serif text-2xl text-[var(--foreground)]">New Arrivals</Link>
                <Link href="/shop?gender=Men" onClick={() => setIsMobileMenuOpen(false)} className="block font-serif text-2xl text-[var(--foreground)]">Men&apos;s Watches</Link>
                <Link href="/shop?gender=Women" onClick={() => setIsMobileMenuOpen(false)} className="block font-serif text-2xl text-[var(--foreground)]">Women&apos;s Watches</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block font-serif text-2xl text-[var(--foreground)]">The Collection</Link>
                <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="block font-serif text-2xl text-[var(--foreground)]">Track Order</Link>
              </div>
              <div className="space-y-3 pt-6 border-t border-[var(--border)]">
                <p className="eyebrow">The Maisons</p>
                {BRANDS.map((b) => (
                  <Link
                    key={b.name}
                    href={`/shop?brand=${encodeURIComponent(b.name)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base text-[var(--foreground)]/80"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-[var(--border)]">
                <p className="eyebrow">Account</p>
                {user ? (
                  <>
                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block text-base text-[var(--foreground)]/80">My Account</Link>
                    <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="block text-base text-[var(--foreground)]/80">My Orders</Link>
                    <button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} className="block text-base text-[var(--foreground)]/80 text-left">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/account/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-base text-[var(--foreground)]/80">Sign In</Link>
                    <Link href="/account/signup" onClick={() => setIsMobileMenuOpen(false)} className="block text-base text-[var(--foreground)]/80">Create Account</Link>
                  </>
                )}
              </div>
              <div className="space-y-3 pt-6 border-t border-[var(--border)]">
                <p className="eyebrow">Maison</p>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-base text-[var(--foreground)]/80">Heritage</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-base text-[var(--foreground)]/80">Boutique · Concierge</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
