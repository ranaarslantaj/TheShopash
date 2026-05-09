'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Upload,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { createProduct } from '@/lib/db';
import { Product, WatchBrand, Gender, WatchStyle, ProductTag } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

const REQUIRED = ['title', 'brand', 'gender', 'style', 'pricePKR', 'priceUSD', 'stock', 'description'];

const VALID_BRANDS: WatchBrand[] = [
  'Rolex', 'Tomi', 'Tissot', 'Cartier', 'Casio', 'Seiko', 'Other',
];
const VALID_GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];
const VALID_STYLES: WatchStyle[] = ['Dress', 'Sport', 'Diver', 'Chronograph'];
const VALID_TAGS: ProductTag[] = ['new', 'bestseller', 'editors-pick', 'rare'];

interface ParsedRow {
  raw: Record<string, string>;
  product?: Omit<Product, 'id'>;
  errors: string[];
  warnings: string[];
}

// ─── Minimal CSV parser (handles quoted fields + commas in values) ────
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 2;
        continue;
      }
      if (c === '"') {
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ',') {
      cur.push(field);
      field = '';
      i++;
      continue;
    }
    if (c === '\r') {
      i++;
      continue;
    }
    if (c === '\n') {
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = '';
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
};

const validateRow = (raw: Record<string, string>): ParsedRow => {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED) {
    if (!raw[key]?.trim()) errors.push(`Missing ${key}`);
  }

  const brand = raw.brand?.trim() as WatchBrand;
  if (brand && !VALID_BRANDS.includes(brand)) {
    errors.push(`Invalid brand "${brand}". Must be one of: ${VALID_BRANDS.join(', ')}`);
  }
  const gender = raw.gender?.trim() as Gender;
  if (gender && !VALID_GENDERS.includes(gender)) {
    errors.push(`Invalid gender "${gender}". Must be Men/Women/Unisex`);
  }
  const style = raw.style?.trim() as WatchStyle;
  if (style && !VALID_STYLES.includes(style)) {
    errors.push(`Invalid style "${style}". Must be Dress/Sport/Diver/Chronograph`);
  }

  const pricePKR = Number(raw.pricePKR);
  const priceUSD = Number(raw.priceUSD);
  const stock = Number(raw.stock);
  if (raw.pricePKR && (isNaN(pricePKR) || pricePKR <= 0)) errors.push('pricePKR must be a positive number');
  if (raw.priceUSD && (isNaN(priceUSD) || priceUSD <= 0)) errors.push('priceUSD must be a positive number');
  if (raw.stock && (isNaN(stock) || stock < 0)) errors.push('stock must be a non-negative number');

  // Images: pipe-delimited URLs
  const images = (raw.images ?? '')
    .split('|')
    .map((u) => u.trim())
    .filter(Boolean);
  if (images.length === 0) {
    warnings.push('No images — product will have a blank thumbnail until you add some');
  }

  // Tags: comma-delimited (within the cell). To use commas we expect them quoted.
  const tags = (raw.tags ?? '')
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter(Boolean) as ProductTag[];
  const invalidTags = tags.filter((t) => !VALID_TAGS.includes(t));
  if (invalidTags.length) {
    warnings.push(`Unknown tags ignored: ${invalidTags.join(', ')}`);
  }
  const cleanTags = tags.filter((t) => VALID_TAGS.includes(t));

  if (errors.length > 0) {
    return { raw, errors, warnings };
  }

  const product: Omit<Product, 'id'> = {
    title: raw.title.trim(),
    description: raw.description.trim(),
    brand,
    gender,
    style,
    pricePKR,
    priceUSD,
    stock,
    images,
    category: 'Watches',
    reference: raw.reference?.trim() || undefined,
    tags: cleanTags.length > 0 ? cleanTags : undefined,
  };

  return { raw, product, errors, warnings };
};

const TEMPLATE = [
  'title,reference,brand,gender,style,pricePKR,priceUSD,stock,description,images,tags',
  '"Rolex Submariner Date",126610LN,Rolex,Men,Diver,2900000,10400,3,"The original tool diver…",https://example.com/a.jpg|https://example.com/b.jpg,"bestseller,editors-pick"',
  '"Tomi Classic Chronograph",T-001,Tomi,Men,Chronograph,8500,30,25,"Bold three-counter chronograph…",https://example.com/c.jpg,new',
  '"Casio G-Shock GA-2100",GA-2100-1A,Casio,Unisex,Sport,18500,65,15,"The CasiOak — octagonal carbon-core case…",https://example.com/d.jpg,"new,bestseller"',
].join('\n');

export default function ProductImportPage() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ created: number; failed: number } | null>(null);
  const [error, setError] = useState('');

  const validCount = useMemo(() => rows.filter((r) => r.errors.length === 0).length, [rows]);
  const errorCount = useMemo(() => rows.filter((r) => r.errors.length > 0).length, [rows]);

  const handleFile = async (file: File) => {
    setError('');
    setResults(null);
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please choose a .csv file.');
      return;
    }
    setFileName(file.name);
    const text = await file.text();
    const cells = parseCSV(text);
    if (cells.length < 2) {
      setError('CSV is empty or has no data rows.');
      setRows([]);
      return;
    }
    const headers = cells[0].map((h) => h.trim());
    const parsed: ParsedRow[] = cells.slice(1).map((cellsRow) => {
      const raw: Record<string, string> = {};
      headers.forEach((h, i) => {
        raw[h] = cellsRow[i] ?? '';
      });
      return validateRow(raw);
    });
    setRows(parsed);
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopash-products-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    setImporting(true);
    setError('');
    setProgress(0);
    setResults(null);
    let created = 0;
    let failed = 0;

    for (const row of rows) {
      if (row.errors.length > 0 || !row.product) {
        failed++;
        setProgress((p) => p + 1);
        continue;
      }
      try {
        await createProduct(row.product);
        created++;
      } catch (err) {
        console.error('Import row failed:', err);
        failed++;
      }
      setProgress((p) => p + 1);
    }
    setResults({ created, failed });
    setImporting(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-3 h-3" /> All products
      </Link>

      <header>
        <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">Bulk import</span>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Import products from CSV</h1>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl">
          Paste your catalogue from a spreadsheet. Each row creates one product. Image URLs are
          comma-delimited inside the <code className="text-[var(--foreground)]">images</code> column;
          for direct uploads, use the regular product form instead.
        </p>
      </header>

      {/* Template + dropzone */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg text-[var(--foreground)]">1 · Choose your file</h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              We&apos;ll preview every row before anything is written.
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)] border border-[var(--border)] px-4 py-2 hover:border-[var(--foreground)]/40 transition-colors"
          >
            <Download className="w-3 h-3" /> Download template
          </button>
        </div>

        <label className="block cursor-pointer border-2 border-dashed border-[var(--border)] hover:border-primary p-8 text-center bg-[var(--soft)]/40 transition-colors">
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <Upload className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-sm text-[var(--foreground)]">
            {fileName ? `Selected: ${fileName}` : (
              <>
                Click to choose a <span className="text-primary underline">.csv</span> file
              </>
            )}
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mt-2">
            Required columns: title, brand, gender, style, pricePKR, priceUSD, stock, description
          </p>
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 flex items-start gap-2">
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
            {error}
          </div>
        )}
      </section>

      {/* Preview */}
      {rows.length > 0 && (
        <section className="bg-white border border-[var(--border)] shadow-sm">
          <div className="px-6 py-5 border-b border-[var(--border)] flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="font-serif text-lg text-[var(--foreground)]">2 · Review</h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                <span className="text-green-600">{validCount} valid</span>
                {errorCount > 0 && (
                  <>
                    {' · '}
                    <span className="text-red-600">{errorCount} with errors</span>
                  </>
                )}
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={importing || validCount === 0}
              className="inline-flex items-center gap-2 bg-[var(--foreground)] text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {importing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Importing… {progress}/{rows.length}
                </>
              ) : (
                <>Import {validCount} {validCount === 1 ? 'product' : 'products'}</>
              )}
            </button>
          </div>

          {results && (
            <div
              className={`px-6 py-4 border-b border-[var(--border)] flex items-center gap-2 text-sm ${
                results.failed === 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Imported {results.created} {results.created === 1 ? 'product' : 'products'}
                {results.failed > 0 && ` · ${results.failed} failed`}
              </span>
              {results.created > 0 && (
                <Link
                  href="/admin/products"
                  className="ml-auto text-[10px] uppercase tracking-[0.3em] underline-offset-4 hover:underline"
                >
                  View catalogue →
                </Link>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] bg-[var(--soft)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Brand</th>
                  <th className="px-4 py-3 font-medium">Price (PKR)</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {rows.map((r, i) => {
                  const ok = r.errors.length === 0;
                  return (
                    <tr key={i} className={ok ? '' : 'bg-red-50/40'}>
                      <td className="px-4 py-3">
                        {ok ? (
                          <span className="inline-flex items-center gap-1 text-green-700 text-[10px] uppercase tracking-[0.2em]">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 text-[10px] uppercase tracking-[0.2em]">
                            <X className="w-3 h-3" /> Error
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--foreground)] truncate max-w-[200px]">
                        {r.raw.title || <span className="text-[var(--muted)]">(no title)</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--muted)]">{r.raw.brand}</td>
                      <td className="px-4 py-3 text-xs text-primary tabular-nums">
                        {r.raw.pricePKR && !isNaN(Number(r.raw.pricePKR))
                          ? formatPrice(Number(r.raw.pricePKR), 'PKR')
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--muted)]">{r.raw.stock}</td>
                      <td className="px-4 py-3">
                        {r.errors.length === 0 && r.warnings.length === 0 ? (
                          <span className="text-[10px] text-[var(--muted)]">—</span>
                        ) : (
                          <ul className="text-[11px] space-y-0.5">
                            {r.errors.map((e, j) => (
                              <li key={`e${j}`} className="text-red-600">• {e}</li>
                            ))}
                            {r.warnings.map((w, j) => (
                              <li key={`w${j}`} className="text-amber-700">• {w}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Help */}
      <section className="bg-[var(--soft)] border border-[var(--border)] p-6 text-sm text-[var(--muted)] space-y-3">
        <h3 className="font-serif text-base text-[var(--foreground)]">CSV format reference</h3>
        <ul className="space-y-1.5 text-xs leading-relaxed">
          <li><strong className="text-[var(--foreground)]">Required:</strong> title, brand, gender, style, pricePKR, priceUSD, stock, description</li>
          <li><strong className="text-[var(--foreground)]">Optional:</strong> reference, images, tags</li>
          <li><strong className="text-[var(--foreground)]">images:</strong> pipe-delimited URLs — e.g. <code>https://a.jpg|https://b.jpg</code></li>
          <li><strong className="text-[var(--foreground)]">tags:</strong> any of <code>new, bestseller, editors-pick, rare</code> separated by commas, semicolons, or pipes</li>
          <li><strong className="text-[var(--foreground)]">brand:</strong> exact match — Rolex, Tomi, Tissot, Cartier, Casio, Seiko, Other</li>
          <li>If your description contains commas, wrap the whole field in <code>&quot;double quotes&quot;</code>.</li>
        </ul>
      </section>
    </div>
  );
}
