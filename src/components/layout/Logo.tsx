'use client';

import React, { useState } from 'react';

interface LogoProps {
  /**
   * `mark` — the monogram only (no text). Best for headers, mobile drawers, anywhere compact.
   * `full` — the full lockup with "THE SHOPASH" text. Best for footers, login screens, hero contexts.
   */
  variant?: 'mark' | 'full';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'mark', className = '' }) => {
  const [errored, setErrored] = useState(false);
  const src = variant === 'full' ? '/logo/logo.png' : '/logo/logo-mark.png';

  if (errored) {
    // Graceful fallback if the image hasn't been uploaded yet — show a wordmark.
    return (
      <span
        className={`inline-flex flex-col items-center justify-center font-serif tracking-[0.35em] font-light luxury-text-gradient leading-none ${
          variant === 'full' ? 'text-2xl' : 'text-xl'
        } ${className}`}
        aria-label="The Shopash"
      >
        <span className="whitespace-nowrap">THE SHOPASH</span>
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="The Shopash"
      className={className}
      onError={() => setErrored(true)}
      draggable={false}
    />
  );
};

export default Logo;
