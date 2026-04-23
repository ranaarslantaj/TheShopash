'use client';

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MOCK_PRODUCTS } from '@/lib/products';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setStatus('loading');
    setMessage('Starting seed process...');

    try {
      if (!db) {
        setStatus('error');
        setMessage('Firebase is not configured. Add your credentials to .env.local to seed.');
        return;
      }
      const productsRef = collection(db, 'products');
      const existingDocs = await getDocs(query(productsRef, limit(1)));

      if (!existingDocs.empty) {
        if (!confirm('Products already exist in Firestore. Do you want to add mock products anyway?')) {
          setStatus('idle');
          setMessage('Seed cancelled.');
          return;
        }
      }

      for (const product of MOCK_PRODUCTS) {
        const { id, ...productData } = product;
        await addDoc(productsRef, {
          ...productData,
          createdAt: serverTimestamp(),
        });
        setMessage(`Added: ${product.title}`);
      }

      setStatus('success');
      setMessage(`Successfully seeded ${MOCK_PRODUCTS.length} luxury timepieces to Firestore!`);
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage(`Error: ${error.message}. Make sure your .env.local is configured.`);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="pt-20 pb-20 bg-[var(--background)] min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-serif text-[var(--foreground)] mb-8">Database Seeder</h1>
          <p className="text-[var(--muted)] mb-12 max-w-xl mx-auto">
            Uploads the curated watch catalogue from <code className="text-primary">lib/products.ts</code> to your Firestore
            <code className="text-primary"> products</code> collection (including brand + gender metadata).
          </p>

          <div className="bg-white border border-[var(--border)] p-12 max-w-lg mx-auto shadow-sm">
            {status === 'success' ? (
              <div className="space-y-6">
                <div className="text-primary text-5xl">✓</div>
                <h2 className="text-2xl text-[var(--foreground)] font-serif">Seed Complete</h2>
                <p className="text-[var(--muted)]">{message}</p>
                <button onClick={() => (window.location.href = '/shop')} className="luxury-button inline-block">
                  Go to Shop
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-[var(--muted)] text-sm">{message || 'Ready to seed database'}</p>
                <button
                  onClick={handleSeed}
                  disabled={status === 'loading'}
                  className={`luxury-button w-full ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {status === 'loading' ? 'Uploading...' : 'Upload Mock Products'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
