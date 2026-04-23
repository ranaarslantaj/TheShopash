'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        if (pathname !== '/admin/login' && pathname !== '/admin/seed') {
          router.push('/admin/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleSignOut = async () => {
    if (auth) await signOut(auth);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (pathname === '/admin/login' || pathname === '/admin/seed') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[var(--border)] p-6">
        <div className="mb-12">
          <Link href="/" className="text-xl font-serif tracking-widest luxury-text-gradient">
            SHOP ASH
          </Link>
          <span className="block text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1">Admin Console</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 text-sm transition-all ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[#f3f1ea]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-sm text-[var(--muted)] hover:text-red-500 transition-colors mt-auto border-t border-[var(--border)] pt-6"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)] px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-serif luxury-text-gradient">SHOP ASH</Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[var(--foreground)]">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 lg:pt-0">
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">{children}</div>
      </main>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/98 p-12 flex flex-col">
          <button onClick={() => setSidebarOpen(false)} className="absolute top-6 right-6 text-[var(--foreground)] text-2xl">
            <X />
          </button>
          <div className="space-y-8 mt-12">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-6 text-2xl font-serif text-[var(--foreground)] hover:text-primary"
              >
                <item.icon className="w-6 h-6 text-primary" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-6 text-2xl font-serif text-[var(--muted)] pt-8 border-t border-[var(--border)] w-full"
            >
              <LogOut className="w-6 h-6" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
