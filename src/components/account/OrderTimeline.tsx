import React from 'react';
import { OrderStatus } from '@/lib/db';
import { Clock, CheckCircle2, Package, Truck, Home, XCircle } from 'lucide-react';

const STEPS: { key: OrderStatus; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'shipped', label: 'Shipped', icon: Package },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const ORDER: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'out-for-delivery', 'delivered'];

interface Props {
  status: OrderStatus;
}

const OrderTimeline: React.FC<Props> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 p-6 flex items-center gap-4">
        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <p className="font-serif text-lg text-red-700">This order has been cancelled</p>
          <p className="text-xs text-red-600 mt-1">Contact our concierge for assistance.</p>
        </div>
      </div>
    );
  }

  const currentIdx = ORDER.indexOf(status);

  return (
    <div className="bg-[var(--soft)] border border-[var(--border)] p-6 md:p-8">
      <div className="grid grid-cols-5 relative">
        {/* Connecting line */}
        <div className="absolute top-6 left-[10%] right-[10%] h-px bg-[var(--border)]" />
        <div
          className="absolute top-6 left-[10%] h-px bg-primary transition-all duration-500"
          style={{ width: `${currentIdx <= 0 ? 0 : (currentIdx / (STEPS.length - 1)) * 80}%` }}
        />

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const reached = i <= currentIdx;
          const current = i === currentIdx;
          return (
            <div key={step.key} className="flex flex-col items-center relative">
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  reached
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-[var(--border)] text-[var(--muted)]'
                } ${current ? 'ring-4 ring-primary/20' : ''}`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <p
                className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-3 text-center ${
                  reached ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
