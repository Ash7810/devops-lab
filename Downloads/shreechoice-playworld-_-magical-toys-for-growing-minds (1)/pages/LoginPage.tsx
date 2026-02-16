
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from '../lib/router';
import { useRouter } from '../contexts/RouterContext';
import { useToast } from '../contexts/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { onNavigate } = useRouter();
    const { showToast } = useToast();
    useDocumentTitle('Login to your Account');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            showToast('Logged in successfully!');
            const params = new URLSearchParams(window.location.search);
            const redirectUrl = params.get('redirect');
            onNavigate(redirectUrl || '/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const redirectParam = new URLSearchParams(window.location.search).get('redirect');
    const registerLink = `/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`;

    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center pt-40 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 clay-panel p-8 sm:p-10 relative z-10 animate-fade-in-up">
                <div className="text-center">
                    <h2 className="text-3xl font-brand text-brand-primary">Welcome Back!</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in to access your orders and wishlist</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all mt-1" placeholder="name@example.com" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all mt-1" placeholder="••••••••" />
                        </div>
                    </div>
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg font-medium">{error}</div>}
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary clay-btn disabled:opacity-50 transition-all active:scale-[0.98]">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="text-center text-sm">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link href={registerLink} className="font-bold text-brand-secondary hover:underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
