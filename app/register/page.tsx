'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }

            // Auto-login after successful registration
            const signInResult = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                router.push('/login');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] opacity-30" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card p-8 rounded-2xl shadow-xl border border-border w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-2xl font-black tracking-tight text-foreground">
                            Nivesh<span className="text-primary">AI</span>
                        </span>
                    </Link>
                    <h1 className="text-xl font-bold text-foreground mb-2">Create Account</h1>
                    <p className="text-muted-foreground text-sm">Join Nivesh AI to start investing</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-lg mb-6 text-sm text-center font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none placeholder:text-muted-foreground/50"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none placeholder:text-muted-foreground/50"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none placeholder:text-muted-foreground/50"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-muted-foreground text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
