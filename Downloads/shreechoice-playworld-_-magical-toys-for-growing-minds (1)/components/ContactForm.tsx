
import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { MailIcon, PhoneIcon, MapPinIcon } from './icons/Icon';
import { THEME } from '../theme.config';

export const ContactForm: React.FC = () => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        showToast("Thanks for your message! We'll be in touch soon.");
        setFormData({ name: '', email: '', phone: '', message: '' });
    };
    
    return (
        <div className={`container-custom`}>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                {/* Left: Info */}
                <div className="flex-1 lg:max-w-md pt-0 lg:pt-8 w-full">
                    <span className="text-brand-primary font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">Get in touch</span>
                    <h2 className="text-3xl md:text-4xl font-heading text-brand-dark mb-6 leading-tight">We're here to help you play better.</h2>
                    <p className="text-slate-600 mb-10 text-base md:text-lg leading-relaxed">
                        Have questions about a product, your order, or just want to say hi? 
                        Drop us a line and our team will get back to you within 24 hours.
                    </p>
                    
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-brand-primary shrink-0 transition-transform hover:scale-110">
                                <MailIcon className="w-6 h-6"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-dark text-lg">Email Us</h4>
                                <a href="mailto:info@shreechoice.in" className="text-slate-600 hover:text-brand-primary transition-colors font-medium">info@shreechoice.in</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-brand-primary shrink-0 transition-transform hover:scale-110">
                                <PhoneIcon className="w-6 h-6"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-dark text-lg">Call Us</h4>
                                <a href="tel:+918668543498" className="text-slate-600 hover:text-brand-primary transition-colors font-medium">+91 86685 43498</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-brand-primary shrink-0 transition-transform hover:scale-110">
                                <MapPinIcon className="w-6 h-6"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-dark text-lg">Visit Us</h4>
                                <p className="text-slate-600 font-medium leading-relaxed">Shop No. 17, Devraj CHS, S V Road,<br/>Goregaon West, Mumbai - 400062</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className={`flex-1 w-full ${THEME.contact.formBackground} p-8 md:p-12 ${THEME.contact.formShape} shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-gray-100`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                                <input 
                                    name="name" type="text" required 
                                    value={formData.name} onChange={handleChange} 
                                    className={`w-full bg-slate-50 border border-slate-200 ${THEME.contact.inputShape} px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all`}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                                <input 
                                    name="phone" type="tel" required 
                                    value={formData.phone} onChange={handleChange} 
                                    className={`w-full bg-slate-50 border border-slate-200 ${THEME.contact.inputShape} px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all`}
                                    placeholder="+91..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                            <input 
                                name="email" type="email" required 
                                value={formData.email} onChange={handleChange} 
                                className={`w-full bg-slate-50 border border-slate-200 ${THEME.contact.inputShape} px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all`}
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                            <textarea 
                                name="message" required 
                                value={formData.message} onChange={handleChange} rows={4} 
                                className={`w-full bg-slate-50 border border-slate-200 ${THEME.contact.inputShape} px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none`}
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button type="submit" className={`w-full bg-brand-primary text-white font-bold py-4 ${THEME.contact.buttonShape} hover:bg-[#002a1c] transition-all transform active:scale-[0.98] shadow-lg shadow-brand-primary/30`}>
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
