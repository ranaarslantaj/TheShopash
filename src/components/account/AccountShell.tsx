'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Loader2, User, Package, ClipboardList, LogOut } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const NAV = [
  { href: '/account', label: 'Overview', icon: User, exact: true },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/track', label: 'Track an Order', icon: ClipboardList },
];

interface Props {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}

const AccountShell: React.FC<Props> = ({ title, eyebrow, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/account/login?next=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <main>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-[var(--background)]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  const initial = user.displayName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '';

  return (
    <main>
      <Navbar />

      <section className="bg-[var(--soft)] border-b border-[var(--border)]">
        <div className="container mx-auto px-6 py-12">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="text-3xl md:text-5xl font-serif text-[var(--foreground)] mt-2">{title}</h1>
        </div>
      </section>

      <section className="py-12 bg-[var(--background)] min-h-[60vh]">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
          <aside className="space-y-1">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="font-serif text-base text-[var(--foreground)] truncate">
                  {user.displayName || 'Welcome'}
                </p>
                <p className="text-xs text-[var(--muted)] truncate">{user.email}</p>
              </div>
            </div>
            {NAV.map((n) => {
              const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    active
                      ? 'bg-[var(--soft)] text-primary border-l-2 border-primary'
                      : 'text-[var(--foreground)]/80 hover:bg-[var(--soft)] border-l-2 border-transparent'
                  }`}
                >
                  <n.icon className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            })}
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--muted)] hover:text-red-500 w-full text-left mt-6 pt-6 border-t border-[var(--border)]"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </aside>

          <div>{children}</div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AccountShell;
