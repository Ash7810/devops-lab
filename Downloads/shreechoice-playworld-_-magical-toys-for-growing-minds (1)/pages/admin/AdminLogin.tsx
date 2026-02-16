
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from '../../contexts/RouterContext';

export const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { onNavigate } = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if(email !== 'admin@shreechoice.com') {
             alert('Unauthorized Access');
             setLoading(false);
             return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error) {
            onNavigate('/admin');
        } else {
            alert(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-700">
                <div className="text-center mb-8">
                     <h1 className="font-heading text-3xl text-brand-primary">SHREE CHOICE <br/> <span className="text-brand-secondary">PLAYWORLD</span></h1>
                     <h2 className="text-xl font-bold text-gray-800 mt-4">Admin Portal</h2>
                     <p className="text-gray-500 text-sm">Secure Access Required</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none" placeholder="admin@shreechoice.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none" placeholder="********" />
                    </div>
                    <button disabled={loading} className="w-full bg-[#0F172A] text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-lg">
                        {loading ? 'Accessing...' : 'Access Dashboard'}
                    </button>
                    <button type="button" onClick={() => onNavigate('/')} className="w-full text-gray-500 text-sm hover:underline">
                        ← Back to Store
                    </button>
                </form>
            </div>
        </div>
    );
};
