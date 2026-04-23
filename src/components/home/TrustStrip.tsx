import React from 'react';
import { ShieldCheck, Truck, Sparkles, LifeBuoy } from 'lucide-react';

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Authenticated',
    copy: 'Every timepiece verified by our master watchmakers',
  },
  {
    icon: Truck,
    title: 'Insured Delivery',
    copy: 'Complimentary worldwide shipping, fully insured',
  },
  {
    icon: Sparkles,
    title: 'Concierge Service',
    copy: 'Personal sourcing and lifetime advisory',
  },
  {
    icon: LifeBuoy,
    title: 'Professional Service',
    copy: 'In-house servicing for every Maison we carry',
  },
];

const TrustStrip = () => {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--soft)]">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border)]">
        {ITEMS.map((item, i) => (
          <div key={i} className="flex items-start gap-4 px-4 md:px-8 py-8 first:pl-0 last:pr-0">
            <item.icon className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.2} />
            <div>
              <p className="font-serif text-base text-[var(--foreground)] leading-tight">{item.title}</p>
              <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStrip;
