'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError('Invalid credentials or unauthorized access.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="pt-40 pb-20 bg-black min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white/5 border border-white/10 p-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-serif text-white mb-2">Admin Console</h1>
              <p className="text-white/40 text-sm">Sign in to manage Shop Ash</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="luxury-button w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>
            
            <p className="mt-8 text-center text-[10px] text-white/20 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
