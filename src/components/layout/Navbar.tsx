'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, User, Search, ChevronDown, Package, LogOut, ClipboardList } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from './AnnouncementBar';
import Logo from './Logo';

const BRANDS = [
  { name: 'Rolex', tagline: 'A Crown for Every Achievement' },
  { name: 'Tomi', tagline: 'Modern. Bold. Accessible.' },
  { name: 'Tissot', tagline: 'Innovators Since 1853' },
  { name: 'Cartier', tagline: 'The Jeweller of Kings' },
  { name: 'Casio', tagline: 'Tough by Design' },
  { name: 'Seiko', tagline: 'The Spirit of Japan' },
  { name: 'Other Brands', tagline: 'Discover the full collection' },
];

const MEN_LINKS = [
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

const NAV_LINKS = [
  { label: 'Watches',     href: '/shop' },
  { label: 'New',         href: '/shop?tag=new' },
  { label: 'Men',         menu: 'men' as const },
  { label: 'Women',       menu: 'women' as const },
  { label: 'Brands',      menu: 'brands' as const },
  { label: 'Bestsellers', href: '/shop?tag=bestseller' },
  { label: 'Heritage',    href: '/about' },
  { label: 'Contact',     href: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | 'men' | 'women' | 'brands'>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const { cartCount, openDrawer } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    let pending = false;
    let raf = 0;

    const tick = () => {
      pending = false;
      const current = window.scrollY;
      const delta = current - lastScrollY.current;

      setIsScrolled((prev) => {
        const next = current > 40;
        return prev === next ? prev : next;
      });

      setHidden((prev) => {
        if (current < 80) return prev === false ? prev : false;
        if (delta > 8) return prev === true ? prev : true;       // scrolling down
        if (delta < -8) return prev === false ? prev : false;    // scrolling up
        return prev;
      });

      lastScrollY.current = current;
    };

    const handleScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Force the header to show whenever a menu/search/dropdown is open
  useEffect(() => {
    if (openMenu || searchOpen || accountOpen || isMobileMenuOpen) {
      setHidden(false);
    }
  }, [openMenu, searchOpen, accountOpen, isMobileMenuOpen]);

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
      <header className="fixed top-0 left-0 w-full z-50">
        {/* Announcement bar — collapses on scroll-down */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            hidden ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
          }`}
        >
          <AnnouncementBar />
        </div>

        <nav
          className={`relative w-full bg-white transition-shadow duration-300 ${
            isScrolled ? 'shadow-[0_1px_0_0_var(--border)]' : 'border-b border-[var(--border)]'
          }`}
          onMouseLeave={() => setOpenMenu(null)}
        >
          {/* Single unified row: logo · menu · icons */}
          <div className="container mx-auto px-6 grid grid-cols-12 items-center py-2 lg:py-3 gap-4">
            {/* LEFT — hamburger + logo */}
            <div className="col-span-6 lg:col-span-3 flex items-center gap-3">
              <button
                className="lg:hidden text-[var(--foreground)]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center" aria-label="The Shopash — home">
                <Logo variant="mark" className="h-12 md:h-16 w-auto" />
              </Link>
            </div>

            {/* CENTER — nav menu (desktop only) */}
            <ul className="hidden lg:flex justify-center items-center gap-7 col-span-6">
              {NAV_LINKS.map((link) => {
                if ('menu' in link && link.menu) {
                  const menuKey = link.menu;
                  return (
                    <li key={link.label} className="relative" onMouseEnter={() => setOpenMenu(menuKey)}>
                      <button className="nav-link flex items-center gap-1">
                        {link.label} <ChevronDown className="w-3 h-3" />
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={link.label} onMouseEnter={() => setOpenMenu(null)}>
                    <Link href={link.href} className="nav-link">
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* RIGHT — icons only */}
            <div className="col-span-6 lg:col-span-3 flex items-center justify-end gap-5 lg:gap-6">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[var(--foreground)] hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Track order */}
              <Link
                href="/track"
                className="hidden md:inline-flex text-[var(--foreground)] hover:text-primary transition-colors"
                aria-label="Track order"
              >
                <Package className="w-5 h-5" />
              </Link>

              {/* Account */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center text-[var(--foreground)] hover:text-primary transition-colors"
                  aria-label={user ? 'Account' : 'Sign in'}
                >
                  {user ? (
                    <span className="w-7 h-7 rounded-full bg-[var(--foreground)] text-white flex items-center justify-center text-[11px] font-medium">
                      {userInitial}
                    </span>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
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
                            <Link href="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--soft)] transition-colors">
                              <User className="w-4 h-4 text-[var(--muted)]" /> My Account
                            </Link>
                            <Link href="/account/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--soft)] transition-colors">
                              <Package className="w-4 h-4 text-[var(--muted)]" /> My Orders
                            </Link>
                            <Link href="/track" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--soft)] transition-colors">
                              <ClipboardList className="w-4 h-4 text-[var(--muted)]" /> Track an Order
                            </Link>
                            <button onClick={handleSignOut} className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--soft)] transition-colors w-full text-left border-t border-[var(--border)] mt-2 pt-3">
                              <LogOut className="w-4 h-4 text-[var(--muted)]" /> Sign Out
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 space-y-4">
                          <p className="text-sm text-[var(--muted)] font-light leading-relaxed">
                            Sign in to view your orders, manage your account, and unlock private previews.
                          </p>
                          <Link href="/account/login" onClick={() => setAccountOpen(false)} className="block w-full text-center bg-[var(--foreground)] text-white px-5 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-primary transition-colors">
                            Sign In
                          </Link>
                          <Link href="/account/signup" onClick={() => setAccountOpen(false)} className="block w-full text-center border border-[var(--foreground)] text-[var(--foreground)] px-5 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-[var(--foreground)] hover:text-white transition-colors">
                            Create Account
                          </Link>
                          <div className="pt-3 border-t border-[var(--border)]">
                            <Link href="/track" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-primary transition-colors">
                              <ClipboardList className="w-4 h-4" /> Track an order without signing in
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button onClick={openDrawer} className="relative group" aria-label={`Open cart, ${cartCount} items`}>
                <ShoppingBag className="w-5 h-5 text-[var(--foreground)] group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--foreground)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mega menu — sibling of the collapsing main nav, so it's not clipped */}
          <AnimatePresence>
            {openMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 right-0 top-full bg-white border-t border-[var(--border)] shadow-lg"
              >
                  <div className="container mx-auto px-6 py-10">
                    {openMenu === 'brands' && (
                      <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                        {BRANDS.map((b) => (
                          <Link
                            key={b.name}
                            href={
                              b.name === 'Other Brands'
                                ? '/shop'
                                : `/shop?brand=${encodeURIComponent(b.name)}`
                            }
                            className="group"
                            onClick={() => setOpenMenu(null)}
                          >
                            <p className="font-serif text-lg text-[var(--foreground)] group-hover:text-primary transition-colors">{b.name}</p>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mt-1">{b.tagline}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                    {openMenu === 'men' && (
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <p className="eyebrow">Shop by Style</p>
                          {MEN_LINKS.map((l) => (
                            <Link key={l.label} href={l.href} onClick={() => setOpenMenu(null)} className="block text-sm text-[var(--foreground)]/80 hover:text-primary transition-colors">
                              {l.label}
                            </Link>
                          ))}
                        </div>
                        <Link href="/shop?gender=Men" onClick={() => setOpenMenu(null)} className="block aspect-[3/2] relative overflow-hidden group">
                          <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop" alt="Men's Watches" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                            <Link key={l.label} href={l.href} onClick={() => setOpenMenu(null)} className="block text-sm text-[var(--foreground)]/80 hover:text-primary transition-colors">
                              {l.label}
                            </Link>
                          ))}
                        </div>
                        <Link href="/shop?gender=Women" onClick={() => setOpenMenu(null)} className="block aspect-[3/2] relative overflow-hidden group">
                          <img src="https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=2080&auto=format&fit=crop" alt="Women's Watches" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                  <form onSubmit={(e) => { e.preventDefault(); setSearchOpen(false); }} className="flex items-center gap-4 border-b border-[var(--foreground)] pb-3">
                    <Search className="w-5 h-5 text-[var(--muted)]" />
                    <input autoFocus type="text" placeholder="Search for a Rolex, Patek, Rado…" className="flex-1 bg-transparent text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none text-lg" />
                    <button type="button" onClick={() => setSearchOpen(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                      <X className="w-5 h-5" />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mr-3">Popular:</span>
                    {['Rolex Day-Date', 'Patek Nautilus', 'Rado Ceramic', 'Omega Seamaster'].map((s) => (
                      <Link key={s} href={`/shop`} onClick={() => setSearchOpen(false)} className="text-xs text-[var(--foreground)]/70 hover:text-primary">
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Spacer — reserves layout space so content sits under the fixed header.
          Sized to match the expanded header (announcement bar + single nav row). */}
      <div aria-hidden className="h-[96px] lg:h-[104px]" />

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
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label="The Shopash — home">
                <Logo variant="mark" className="h-10 w-auto" />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)}><X /></button>
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
                    href={
                      b.name === 'Other Brands'
                        ? '/shop'
                        : `/shop?brand=${encodeURIComponent(b.name)}`
                    }
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
                    <button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} className="block text-base text-[var(--foreground)]/80 text-left">Sign Out</button>
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
