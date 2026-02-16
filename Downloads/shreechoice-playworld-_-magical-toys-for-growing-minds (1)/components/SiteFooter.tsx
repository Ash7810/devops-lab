
import React from 'react';
import { InstagramIcon, FacebookIcon, MapPinIcon, MailIcon, PhoneIcon } from './icons/Icon';
import { Logo } from './Logo';
import { Link } from '../lib/router';
import { THEME } from '../theme.config';
import { FooterDoodle } from './ui/Doodles';

export const SiteFooter: React.FC = () => {
    return (
        <footer className="relative mt-0 z-20">
            {/* Hand-drawn separation doodle */}
            <div className="w-full flex justify-center bg-transparent relative z-30">
                <FooterDoodle />
            </div>

            <div className={`${THEME.footer.backgroundClass} pt-12 pb-28 md:pb-12 relative`}>
                <div className="container mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="mb-6"><Logo className="h-10 w-auto" /></div>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6">
                                Sparking joy and imagination in every child. We are dedicated to providing safe, educational, and fun toys for the little ones you love.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 border border-brand-primary/20">
                                    <InstagramIcon className="w-5 h-5"/>
                                </a>
                                <a href="#" className="flex w-10 h-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-200">
                                    <FacebookIcon className="w-5 h-5"/>
                                </a>
                            </div>
                        </div>

                        {/* Shop Column */}
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-bold font-heading mb-6 text-brand-dark">Shop Toys</h3>
                            <ul className="space-y-3">
                                {['Arts & Crafts', 'Toys', 'Soft Toys', 'Puzzles'].map((item) => (
                                    <li key={item}>
                                        <Link href={`/shop?category=${encodeURIComponent(item)}`} className="text-slate-600 hover:text-brand-primary hover:translate-x-1 transition-all duration-200 text-sm font-bold block">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-bold font-heading mb-6 text-brand-dark">Support</h3>
                             <ul className="space-y-3">
                                {['Track Order', 'Shipping Policy', 'Returns & Refunds', 'Terms of Service'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-slate-600 hover:text-brand-primary hover:translate-x-1 transition-all duration-200 text-sm font-bold block">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-bold font-heading mb-6 text-brand-dark">Contact Us</h3>
                            <div className="space-y-5">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                    <div className="mt-1 text-brand-primary flex-shrink-0"><MapPinIcon className="w-5 h-5" /></div>
                                    <p className="text-slate-600 text-sm leading-relaxed font-medium">Shop No. 17, Devraj CHS,<br/>S V Road, Goregaon West,<br/>Mumbai - 400062</p>
                                </div>
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                    <div className="mt-1 text-brand-primary flex-shrink-0"><MailIcon className="w-5 h-5" /></div>
                                    <a href="mailto:info@shreechoice.in" className="text-slate-600 hover:text-brand-primary text-sm font-bold transition-colors">info@shreechoice.in</a>
                                </div>
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                    <div className="mt-1 text-brand-primary flex-shrink-0"><PhoneIcon className="w-5 h-5" /></div>
                                    <a href="tel:+918668543498" className="text-slate-600 hover:text-brand-primary text-sm font-bold transition-colors">+91 86685 43498</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
                        <p>© {new Date().getFullYear()} ShreeChoice Playworld. All Rights Reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/admin" className="hover:text-brand-primary transition-colors" title="Admin Login">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </Link>
                            <span>Privacy Policy</span>
                            <span>Sitemap</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
