'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const GoogleMark = () => (
  <svg viewBox="0 0 18 18" className="w-4 h-4">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.61z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.69 9c0-.6.1-1.18.28-1.72V4.94H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.06l3.01-2.34z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
  </svg>
);

export default function AccountLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithEmail, signInWithGoogle, isReady } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const next = searchParams.get('next') ?? '/account';

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push(next);
    } catch (err: any) {
      setError(err?.message?.replace('Firebase: ', '') ?? 'Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push(next);
    } catch (err: any) {
      setError(err?.message?.replace('Firebase: ', '') ?? 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-[var(--border)] px-5 py-3 text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors';

  return (
    <main>
      <Navbar />
      <section className="pt-20 pb-20 bg-[var(--background)] min-h-screen">
        <div className="container mx-auto px-6 max-w-md">
          <div className="text-center mb-10">
            <span className="eyebrow">Welcome back</span>
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mt-4">Sign In</h1>
            <p className="text-sm text-[var(--muted)] mt-3 font-light">
              Don&apos;t have an account?{' '}
              <Link href={`/account/signup${next ? `?next=${next}` : ''}`} className="text-primary underline-offset-4 hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {!isReady && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs p-4 mb-6">
              Firebase is not configured on this environment. Add credentials to <code>.env.local</code> to enable sign-in.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-4 mb-6">{error}</div>
          )}

          <button
            onClick={handleGoogle}
            disabled={loading || !isReady}
            className="w-full flex items-center justify-center gap-3 border border-[var(--border)] bg-white px-5 py-3 text-sm text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors disabled:opacity-50"
          >
            <GoogleMark />
            Continue with Google
          </button>

          <div className="my-8 flex items-center gap-4">
            <span className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--muted)]">or</span>
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <form onSubmit={handleEmail} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Password</label>
                <Link href="/account/forgot-password" className="text-[10px] uppercase tracking-[0.3em] text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--foreground)] text-white px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-10 text-xs text-[var(--muted)]">
            Want to check on a recent order without signing in?{' '}
            <Link href="/track" className="text-primary underline-offset-4 hover:underline">
              Track Order
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
