
import React from 'react';
import { TruckIcon, TagIcon, ShieldCheckIcon, MessageSquareIcon } from './icons/Icon';

const TrustItem = React.memo<{ icon: React.ReactNode, title: string, subtitle: string }>(({ icon, title, subtitle }) => (
  <div className="flex items-center gap-5">
    <div className="text-brand-primary opacity-80 flex-shrink-0">
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-12 h-12" })}
    </div>
    <div>
      <h3 className="font-bold text-lg text-brand-dark">{title}</h3>
      <p className="text-sm text-text-secondary">{subtitle}</p>
    </div>
  </div>
));

export const TrustBar: React.FC = () => {
  return (
    <section className="my-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="clay-panel grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
          <TrustItem icon={<TagIcon />} title="Best Prices" subtitle="Affordable & Fair" />
          <TrustItem icon={<TruckIcon />} title="Fast Shipment" subtitle="Express Delivery" />
          <TrustItem icon={<ShieldCheckIcon />} title="Buyer Protection" subtitle="Satisfaction Guaranteed" />
          <TrustItem icon={<MessageSquareIcon />} title="Live Support" subtitle="Here to Help 24/7" />
        </div>
      </div>
    </section>
  );
};
