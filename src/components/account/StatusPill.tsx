import React from 'react';
import { OrderStatus } from '@/lib/db';

const LABELS: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'border-amber-300 text-amber-700 bg-amber-50' },
  confirmed: { label: 'Confirmed', className: 'border-blue-300 text-blue-700 bg-blue-50' },
  shipped: { label: 'Shipped', className: 'border-indigo-300 text-indigo-700 bg-indigo-50' },
  'out-for-delivery': { label: 'Out for Delivery', className: 'border-purple-300 text-purple-700 bg-purple-50' },
  delivered: { label: 'Delivered', className: 'border-green-300 text-green-700 bg-green-50' },
  cancelled: { label: 'Cancelled', className: 'border-red-300 text-red-600 bg-red-50' },
};

const StatusPill: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const meta = LABELS[status] ?? LABELS.pending;
  return (
    <span className={`text-[9px] uppercase tracking-[0.3em] px-3 py-1 border ${meta.className}`}>
      {meta.label}
    </span>
  );
};

export default StatusPill;
