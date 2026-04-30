'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword, isReady } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message?.replace('Firebase: ', '') ?? 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="pt-20 pb-20 bg-[var(--background)] min-h-screen">
        <div className="container mx-auto px-6 max-w-md">
          <div className="text-center mb-10">
            <span className="eyebrow">Account recovery</span>
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mt-4">Reset Password</h1>
          </div>

          {!isReady ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs p-4 mb-6">
              Firebase is not configured. Password reset is unavailable until <code>.env.local</code> is set.
            </div>
          ) : sent ? (
            <div className="text-center space-y-6">
              <Mail className="w-12 h-12 text-primary mx-auto" />
              <p className="font-serif text-2xl text-[var(--foreground)]">Check your inbox</p>
              <p className="text-sm text-[var(--muted)] font-light">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. The link will expire in one hour.
              </p>
              <Link href="/account/login" className="inline-block text-xs uppercase tracking-[0.3em] text-primary border-b border-primary pb-1">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-4 mb-6">{error}</div>
              )}
              <p className="text-sm text-[var(--muted)] font-light text-center mb-8">
                Enter your email and we&apos;ll send you a secure link to reset your password.
              </p>
              <form onSubmit={handle} className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-[var(--border)] px-5 py-3 text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--foreground)] text-white px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
                </button>
              </form>
              <p className="text-center mt-8 text-xs text-[var(--muted)]">
                Remembered it?{' '}
                <Link href="/account/login" className="text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
