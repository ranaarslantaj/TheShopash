'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MessageCircle, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-black min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4 block">Get in Touch</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-12">
              <p className="text-white/50 font-light leading-relaxed text-lg">
                Our concierge team is here to assist you with any inquiries about our collections, orders, or bespoke requests.
              </p>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-white text-sm font-medium">Phone</p>
                    <p className="text-white/40 text-sm">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <p className="text-white/40 text-sm">concierge@shopash.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-white text-sm font-medium">Address</p>
                    <p className="text-white/40 text-sm">Luxury Avenue, Karachi, Pakistan</p>
                  </div>
                </div>
              </div>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3 bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>

            {/* Contact Form */}
            <div>
              {sent ? (
                <div className="text-center py-20 space-y-4">
                  <Send className="w-12 h-12 text-primary mx-auto" />
                  <p className="text-white font-serif text-xl">Message Sent</p>
                  <p className="text-white/40 text-sm">We&apos;ll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Message</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5}
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" />
                  </div>
                  <button type="submit" className="luxury-button w-full">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
