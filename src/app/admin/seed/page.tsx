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
      // 1. Check if products already exist to avoid duplicates
      const productsRef = collection(db, 'products');
      const existingDocs = await getDocs(query(productsRef, limit(1)));
      
      if (!existingDocs.empty) {
        if (!confirm('Products already exist in Firestore. Do you want to add mock products anyway?')) {
          setStatus('idle');
          setMessage('Seed cancelled.');
          return;
        }
      }

      // 2. Add each mock product
      for (const product of MOCK_PRODUCTS) {
        const { id, ...productData } = product; // Remove mock id to let Firestore generate one
        await addDoc(productsRef, {
          ...productData,
          createdAt: serverTimestamp(),
        });
        setMessage(`Added: ${product.title}`);
      }

      setStatus('success');
      setMessage('Successfully seeded 6 luxury timepieces to Firestore!');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage(`Error: ${error.message}. Make sure your .env.local is configured.`);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-black min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-serif text-white mb-8">Database Seeder</h1>
          <p className="text-white/50 mb-12 max-w-xl mx-auto">
            This tool will upload the initial set of luxury watches from <code className="text-primary">mock/products.ts</code> to your Firestore 
            <code className="text-primary">products</code> collection.
          </p>

          <div className="bg-white/5 border border-white/10 p-12 max-w-lg mx-auto">
            {status === 'success' ? (
              <div className="space-y-6">
                <div className="text-primary text-5xl">✓</div>
                <h2 className="text-2xl text-white font-serif">Seed Complete</h2>
                <p className="text-white/60">{message}</p>
                <button 
                  onClick={() => window.location.href = '/shop'}
                  className="luxury-button inline-block"
                >
                  Go to Shop
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-white/40 text-sm">{message || 'Ready to seed database'}</p>
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
