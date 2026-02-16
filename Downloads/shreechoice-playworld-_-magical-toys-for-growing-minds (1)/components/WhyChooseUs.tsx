
import React from 'react';
import { ShieldCheckIcon, TruckIcon, PackageIcon, ClockIcon } from './icons/Icon';

const FeatureCard = ({ title, subtitle, icon }: { title: string, subtitle: string, icon: React.ReactNode }) => (
    <div className="bg-white p-8 rounded-2xl flex flex-col items-start gap-4 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-brand-primary/20 group h-full">
        <div className="text-brand-primary mb-2 p-3 bg-green-50 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
            {icon}
        </div>
        <div>
            <h3 className="font-heading text-xl text-brand-dark mb-2 font-bold">{title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{subtitle}</p>
        </div>
    </div>
);

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
                title="Free Delivery" 
                subtitle="Free delivery on all orders above ₹999. Valid on all products."
                icon={<TruckIcon className="w-6 h-6" />}
            />
            <FeatureCard 
                title="Quality Guarantee" 
                subtitle="We ensure strict quality checks on all products before shipping."
                icon={<ShieldCheckIcon className="w-6 h-6" />}
            />
            <FeatureCard 
                title="Daily Offers" 
                subtitle="Get amazing discounts and deals on your favorite toys daily."
                icon={<PackageIcon className="w-6 h-6" />}
            />
            <FeatureCard 
                title="100% Secure Payment" 
                subtitle="We ensure your payment is safe and secure with us."
                icon={<ClockIcon className="w-6 h-6" />}
            />
        </div>
    </section>
  );
};
