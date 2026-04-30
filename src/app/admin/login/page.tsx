'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/myadmin');
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--soft)] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
}
