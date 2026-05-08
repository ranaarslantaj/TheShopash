'use client';

import React, { useCallback, useState } from 'react';
import { Loader2, Upload, X, Star, GripVertical } from 'lucide-react';
import { uploadProductImage } from '@/lib/db';

interface ImageUploaderProps {
  productId: string;
  images: string[];
  onChange: (next: string[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  productId,
  images,
  onChange,
  maxImages = 8,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxImages} images.`);
        return;
      }
      const accepted = list.slice(0, remaining).filter((f) => f.type.startsWith('image/'));
      if (!accepted.length) {
        setError('Please upload image files only.');
        return;
      }

      setError('');
      setUploading(true);
      setUploadCount(accepted.length);

      try {
        const uploaded: string[] = [];
        for (const file of accepted) {
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`"${file.name}" is over 5 MB. Please compress before uploading.`);
          }
          const { url } = await uploadProductImage(productId, file);
          uploaded.push(url);
        }
        onChange([...images, ...uploaded]);
      } catch (err: any) {
        setError(err?.message ?? 'Upload failed.');
      } finally {
        setUploading(false);
        setUploadCount(0);
      }
    },
    [productId, images, onChange, maxImages]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const remove = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    onChange(next);
  };

  const promote = (idx: number) => {
    if (idx === 0) return;
    const next = [...images];
    const [moved] = next.splice(idx, 1);
    next.unshift(moved);
    onChange(next);
  };

  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`block cursor-pointer border-2 border-dashed transition-colors p-6 text-center ${
          dragOver
            ? 'border-primary bg-primary/[0.04]'
            : 'border-[var(--border)] hover:border-[var(--foreground)]/30 bg-[var(--soft)]/40'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-[var(--muted)]">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <p className="text-sm">Uploading {uploadCount} {uploadCount === 1 ? 'image' : 'images'}…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--muted)]">
            <Upload className="w-5 h-5 text-primary" />
            <p className="text-sm text-[var(--foreground)]">
              Drag &amp; drop images here, or <span className="text-primary underline">browse</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em]">
              Up to {maxImages} images · Max 5 MB each · JPG/PNG/WebP
            </p>
          </div>
        )}
      </label>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3">{error}</div>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
              {images.length} {images.length === 1 ? 'image' : 'images'} · drag to reorder
            </p>
            <p className="text-[10px] text-[var(--muted)]">
              First image is the primary thumbnail
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((url, i) => (
              <div
                key={url + i}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/index', String(i))}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const from = parseInt(e.dataTransfer.getData('text/index'), 10);
                  move(from, i);
                }}
                className="group relative aspect-square bg-[var(--soft)] border border-[var(--border)] cursor-grab active:cursor-grabbing"
              >
                <img src={url} alt="" className="w-full h-full object-cover" />

                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[8px] uppercase tracking-[0.3em] px-2 py-0.5 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5" /> Primary
                  </span>
                )}

                <span className="absolute top-1.5 right-1.5 bg-black/40 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-3 h-3" />
                </span>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => promote(i)}
                      className="text-[9px] uppercase tracking-[0.3em] text-white border border-white/40 px-2.5 py-1 hover:bg-white hover:text-[var(--foreground)] transition-colors"
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-[9px] uppercase tracking-[0.3em] text-white border border-white/40 px-2.5 py-1 hover:bg-red-500 hover:border-red-500 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
