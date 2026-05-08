'use client';

import React, { useMemo, useState } from 'react';
import { Loader2, AlertCircle, Save } from 'lucide-react';
import {
  Product,
  WatchBrand,
  Gender,
  WatchStyle,
  ProductTag,
} from '@/context/CartContext';
import ImageUploader from './ImageUploader';

const BRANDS: WatchBrand[] = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Rado',
  'Cartier',
  'Tag Heuer',
  'Tissot',
];
const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];
const STYLES: WatchStyle[] = ['Dress', 'Sport', 'Diver', 'Chronograph'];
const TAGS: { key: ProductTag; label: string }[] = [
  { key: 'new', label: 'New Arrival' },
  { key: 'bestseller', label: 'Best Seller' },
  { key: 'editors-pick', label: "Editor's Pick" },
  { key: 'rare', label: 'Rare' },
];

export interface ProductFormValues {
  title: string;
  reference: string;
  brand: WatchBrand;
  gender: Gender;
  style: WatchStyle;
  pricePKR: number | '';
  priceUSD: number | '';
  stock: number | '';
  description: string;
  images: string[];
  tags: ProductTag[];
}

const emptyForm: ProductFormValues = {
  title: '',
  reference: '',
  brand: 'Rolex',
  gender: 'Men',
  style: 'Dress',
  pricePKR: '',
  priceUSD: '',
  stock: 1,
  description: '',
  images: [],
  tags: [],
};

interface ProductFormProps {
  productId: string;
  initialValues?: Partial<Product>;
  onSubmit: (values: Omit<Product, 'id'>) => Promise<void>;
  submitLabel?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  initialValues,
  onSubmit,
  submitLabel = 'Save product',
}) => {
  const [values, setValues] = useState<ProductFormValues>(() => ({
    ...emptyForm,
    ...(initialValues
      ? {
          title: initialValues.title ?? '',
          reference: initialValues.reference ?? '',
          brand: (initialValues.brand as WatchBrand) ?? 'Rolex',
          gender: (initialValues.gender as Gender) ?? 'Men',
          style: (initialValues.style as WatchStyle) ?? 'Dress',
          pricePKR: initialValues.pricePKR ?? '',
          priceUSD: initialValues.priceUSD ?? '',
          stock: initialValues.stock ?? 1,
          description: initialValues.description ?? '',
          images: initialValues.images ?? [],
          tags: (initialValues.tags as ProductTag[]) ?? [],
        }
      : {}),
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const errors = useMemo(() => {
    const e: Partial<Record<keyof ProductFormValues, string>> = {};
    if (!values.title.trim()) e.title = 'Required';
    if (values.pricePKR === '' || Number(values.pricePKR) <= 0) e.pricePKR = 'Required';
    if (values.priceUSD === '' || Number(values.priceUSD) <= 0) e.priceUSD = 'Required';
    if (values.stock === '' || Number(values.stock) < 0) e.stock = 'Required';
    if (!values.description.trim()) e.description = 'Required';
    if (values.images.length === 0) e.images = 'At least one image required';
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const toggleTag = (tag: ProductTag) => {
    setValues((v) => ({
      ...v,
      tags: v.tags.includes(tag) ? v.tags.filter((t) => t !== tag) : [...v.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError('Please fix the errors above before saving.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const payload: Omit<Product, 'id'> = {
        title: values.title.trim(),
        reference: values.reference.trim() || undefined,
        brand: values.brand,
        gender: values.gender,
        style: values.style,
        pricePKR: Number(values.pricePKR),
        priceUSD: Number(values.priceUSD),
        stock: Number(values.stock),
        description: values.description.trim(),
        images: values.images,
        category: 'Watches',
        tags: values.tags.length > 0 ? values.tags : undefined,
      };
      await onSubmit(payload);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors';
  const labelClass = 'block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2';
  const errClass = 'text-[10px] uppercase tracking-[0.3em] text-red-600 mt-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Section: Basics */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-lg text-[var(--foreground)]">Details</h2>

        <div>
          <label className={labelClass}>Title *</label>
          <input
            value={values.title}
            onChange={(e) => update('title', e.target.value)}
            className={inputClass}
            placeholder="e.g. Day-Date Platinum"
          />
          {errors.title && <p className={errClass}>{errors.title}</p>}
        </div>

        <div>
          <label className={labelClass}>Reference number</label>
          <input
            value={values.reference}
            onChange={(e) => update('reference', e.target.value)}
            className={inputClass}
            placeholder="e.g. 228206"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Brand *</label>
            <select
              value={values.brand}
              onChange={(e) => update('brand', e.target.value as WatchBrand)}
              className={inputClass}
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Gender *</label>
            <select
              value={values.gender}
              onChange={(e) => update('gender', e.target.value as Gender)}
              className={inputClass}
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Style *</label>
            <select
              value={values.style}
              onChange={(e) => update('style', e.target.value as WatchStyle)}
              className={inputClass}
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Describe the timepiece — materials, movement, history…"
          />
          {errors.description && <p className={errClass}>{errors.description}</p>}
        </div>
      </section>

      {/* Section: Pricing & Stock */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-lg text-[var(--foreground)]">Pricing &amp; inventory</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Price (PKR) *</label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.pricePKR}
              onChange={(e) => update('pricePKR', e.target.value === '' ? '' : Number(e.target.value))}
              className={inputClass}
              placeholder="1250000"
            />
            {errors.pricePKR && <p className={errClass}>{errors.pricePKR}</p>}
          </div>
          <div>
            <label className={labelClass}>Price (USD) *</label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.priceUSD}
              onChange={(e) => update('priceUSD', e.target.value === '' ? '' : Number(e.target.value))}
              className={inputClass}
              placeholder="4500"
            />
            {errors.priceUSD && <p className={errClass}>{errors.priceUSD}</p>}
          </div>
          <div>
            <label className={labelClass}>Stock *</label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.stock}
              onChange={(e) => update('stock', e.target.value === '' ? '' : Number(e.target.value))}
              className={inputClass}
              placeholder="1"
            />
            {errors.stock && <p className={errClass}>{errors.stock}</p>}
          </div>
        </div>
      </section>

      {/* Section: Images */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-lg text-[var(--foreground)]">Images</h2>
        <ImageUploader
          productId={productId}
          images={values.images}
          onChange={(next) => update('images', next)}
        />
        {errors.images && <p className={errClass}>{errors.images}</p>}
      </section>

      {/* Section: Tags */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-4 shadow-sm">
        <h2 className="font-serif text-lg text-[var(--foreground)]">Merchandising tags</h2>
        <p className="text-sm text-[var(--muted)] font-light">
          Tags drive the home page sections (New Arrivals, Best Sellers, Editor&apos;s Picks).
        </p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => {
            const active = values.tags.includes(t.key);
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => toggleTag(t.key)}
                className={`text-[10px] uppercase tracking-[0.3em] px-4 py-2 border transition-colors ${
                  active
                    ? 'border-primary text-primary bg-primary/[0.04]'
                    : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/30'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Submit bar */}
      <div className="flex items-center justify-end gap-3 sticky bottom-6 z-10">
        <button
          type="submit"
          disabled={submitting || !isValid}
          className="inline-flex items-center gap-2 bg-[var(--foreground)] text-white px-7 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
        >
          {submitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" /> {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
