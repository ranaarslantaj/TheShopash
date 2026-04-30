'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { isAdmin } from '@/lib/admin';
import { Loader2, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyAdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = searchParams.get('error');
    if (e === 'not-authorized') {
      setError('Your account does not have admin access.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!auth) {
      setError('Firebase is not configured.');
      return;
    }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const admin = await isAdmin(cred.user.uid);
      if (!admin) {
        await signOut(auth);
        setError('Access denied. This account is not an administrator.');
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
    } catch (err: any) {
      const code = err?.code || '';
      if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        setError('Invalid email or password.');
      } else if (code.includes('too-many-requests')) {
        setError('Too many attempts. Try again later.');
      } else {
        setError(err?.message?.replace('Firebase: ', '') ?? 'Sign-in failed.');
      }
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-[var(--border)] px-5 py-3 text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors';

  return (
    <main className="min-h-screen bg-[var(--soft)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-10">
          <span className="text-2xl font-serif tracking-[0.3em] luxury-text-gradient font-light">SHOP ASH</span>
          <span className="block text-[10px] uppercase tracking-[0.5em] text-[var(--muted)] mt-2">
            Maison de Horlogerie
          </span>
        </Link>

        <div className="bg-white border border-[var(--border)] p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="eyebrow">Restricted Access</span>
            <h1 className="text-3xl font-serif text-[var(--foreground)] mt-3 mb-1">Admin Console</h1>
            <p className="text-xs text-[var(--muted)]">Authorised personnel only</p>
          </div>

          {!isFirebaseConfigured && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs p-4 mb-6">
              Firebase is not configured on this environment. Add credentials to <code>.env.local</code>.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-4 mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--foreground)] text-white px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating…
                </>
              ) : (
                'Access Console'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
            All access attempts are logged
          </p>
        </div>

        <p className="text-center text-xs text-[var(--muted)] mt-8">
          Customer?{' '}
          <Link href="/account/login" className="text-primary underline-offset-4 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}
