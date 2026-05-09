'use client';

import React, { useEffect, useState } from 'react';
import {
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  Megaphone,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Globe,
} from 'lucide-react';
import {
  getSiteSettings,
  updateSiteSettings,
  SiteSettings,
  DEFAULT_SETTINGS,
} from '@/lib/db';
import { clearSiteSettingsCache } from '@/lib/useSiteSettings';

export default function AdminSettingsPage() {
  const [values, setValues] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [original, setOriginal] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getSiteSettings()
      .then((s) => {
        setValues(s);
        setOriginal(s);
      })
      .finally(() => setLoading(false));
  }, []);

  const dirty = JSON.stringify(values) !== JSON.stringify(original);

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateSiteSettings(values);
      setOriginal(values);
      clearSiteSettingsCache();
      setSavedAt(Date.now());
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setValues(DEFAULT_SETTINGS);
  };

  const inputClass =
    'w-full bg-white border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors';
  const labelClass = 'block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2';

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">
            Site Configuration
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Settings</h1>
          <p className="text-sm text-[var(--muted)] mt-2">
            Manage what appears on the public site — announcement, contact, social.
          </p>
        </div>
        {savedAt && !dirty && (
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-green-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Announcement */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Megaphone className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h2 className="font-serif text-lg text-[var(--foreground)]">Announcement bar</h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              The thin dark stripe at the very top of every page.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={values.announcementEnabled}
              onChange={(e) => update('announcementEnabled', e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
              {values.announcementEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        <div>
          <label className={labelClass}>Message</label>
          <input
            value={values.announcement}
            onChange={(e) => update('announcement', e.target.value)}
            placeholder="Complimentary insured shipping worldwide…"
            className={inputClass}
            disabled={!values.announcementEnabled}
          />
          <p className="text-[10px] text-[var(--muted)] mt-2">
            Keep it short — long lines will wrap awkwardly on mobile.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h2 className="font-serif text-lg text-[var(--foreground)]">Contact details</h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              Used in the footer and on the contact page.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              <Mail className="w-3 h-3 inline mr-1" /> Email
            </label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputClass}
              placeholder="concierge@shopash.com"
            />
          </div>
          <div>
            <label className={labelClass}>
              <Phone className="w-3 h-3 inline mr-1" /> Phone (display)
            </label>
            <input
              value={values.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={inputClass}
              placeholder="+92 300 1234567"
            />
          </div>
          <div>
            <label className={labelClass}>
              <MessageCircle className="w-3 h-3 inline mr-1" /> WhatsApp number
            </label>
            <input
              value={values.whatsapp}
              onChange={(e) => update('whatsapp', e.target.value.replace(/\D/g, ''))}
              className={inputClass}
              placeholder="923001234567"
              inputMode="numeric"
            />
            <p className="text-[10px] text-[var(--muted)] mt-2">
              Digits only with country code, no &quot;+&quot;. E.g. <code>923001234567</code>.
              Used for the &quot;Buy via WhatsApp&quot; button on every product page.
            </p>
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              value={values.city}
              onChange={(e) => update('city', e.target.value)}
              className={inputClass}
              placeholder="Karachi"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            <MapPin className="w-3 h-3 inline mr-1" /> Address
          </label>
          <input
            value={values.address}
            onChange={(e) => update('address', e.target.value)}
            className={inputClass}
            placeholder="Luxury Avenue, Karachi, Pakistan"
          />
        </div>
      </section>

      {/* Social */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h2 className="font-serif text-lg text-[var(--foreground)]">Social media</h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              Leave any field blank to hide that icon from the footer.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input
              type="url"
              value={values.instagramUrl}
              onChange={(e) => update('instagramUrl', e.target.value)}
              className={inputClass}
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input
              type="url"
              value={values.facebookUrl}
              onChange={(e) => update('facebookUrl', e.target.value)}
              className={inputClass}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className={labelClass}>YouTube URL</label>
            <input
              type="url"
              value={values.youtubeUrl}
              onChange={(e) => update('youtubeUrl', e.target.value)}
              className={inputClass}
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
        </div>
      </section>

      {/* Save bar */}
      <div className="sticky bottom-6 z-30 flex items-center justify-between gap-4 bg-white border border-[var(--border)] p-4 shadow-lg">
        <button
          onClick={handleReset}
          disabled={saving}
          className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] hover:text-red-500 transition-colors disabled:opacity-50"
        >
          Reset to defaults
        </button>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700">
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 bg-[var(--foreground)] text-white px-7 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
