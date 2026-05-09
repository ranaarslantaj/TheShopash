'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isAdmin } from '@/lib/admin';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/layout/Logo';

// Pages that should NOT be wrapped in the admin shell
const PUBLIC_PATHS = ['/admin/seed'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      // Without Firebase configured, send them to /myadmin where the
      // "not configured" warning is rendered.
      if (!PUBLIC_PATHS.includes(pathname)) router.replace('/myadmin');
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (PUBLIC_PATHS.includes(pathname)) {
        setLoading(false);
        return;
      }
      if (!u) {
        router.replace('/myadmin');
        setLoading(false);
        return;
      }
      const admin = await isAdmin(u.uid);
      if (!admin) {
        await signOut(auth!);
        router.replace('/myadmin?error=not-authorized');
        setLoading(false);
        return;
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [router, pathname]);

  const handleSignOut = async () => {
    if (auth) await signOut(auth);
    router.replace('/myadmin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  if (!user) return null;

  const menuItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const initial = user.displayName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'A';

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[var(--border)] p-6">
        <div className="mb-12">
          <Link href="/" className="inline-block" aria-label="The Shopash — home">
            <Logo variant="mark" className="h-10 w-auto" />
          </Link>
          <span className="block text-[10px] uppercase tracking-widest text-[var(--muted)] mt-3">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
          <span className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="text-sm text-[var(--foreground)] truncate">{user.displayName || 'Admin'}</p>
            <p className="text-[10px] text-[var(--muted)] truncate">{user.email}</p>
          </div>
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
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-[var(--border)] px-5 py-3 flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[var(--foreground)] -ml-1 p-1"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/" aria-label="The Shopash — home" className="flex items-center">
          <Logo variant="mark" className="h-9 w-auto" />
        </Link>
        <span className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium" aria-hidden>
          {initial}
        </span>
      </div>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 lg:pt-0">
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-12">{children}</div>
      </main>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
          />
          {/* Drawer */}
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-[86%] max-w-[340px] z-50 bg-white shadow-2xl flex flex-col animate-[slide-in-left_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <Link href="/" onClick={() => setSidebarOpen(false)} aria-label="Home">
                <Logo variant="mark" className="h-8 w-auto" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[var(--foreground)] p-1"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User card */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium shrink-0">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-[var(--foreground)] truncate">
                  {user.displayName || 'Admin'}
                </p>
                <p className="text-[10px] text-[var(--muted)] truncate">{user.email}</p>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-2">
              {menuItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-4 px-5 py-3.5 text-sm transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                        : 'text-[var(--foreground)]/85 hover:bg-[var(--soft)] border-l-2 border-transparent'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-4 px-5 py-4 text-sm text-[var(--muted)] hover:text-red-500 border-t border-[var(--border)] transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </aside>
        </>
      )}

      {/* Slide-in keyframe (Tailwind doesn't ship a left-side variant) */}
      <style jsx>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
