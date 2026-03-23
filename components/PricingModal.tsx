'use client';

import { Sparkles, Check, X, Shield, Zap, TrendingUp } from 'lucide-react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: () => void;
}

export default function PricingModal({ isOpen, onClose, onSubscribe }: PricingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff9d]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-xl"
                >
                    <X size={20} />
                </button>

                <div className="p-10 md:p-12 space-y-8 relative z-10">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-[#00ff9d]/10 rounded-2xl mb-2">
                            <Sparkles className="w-8 h-8 text-[#00ff9d]" />
                        </div>
                        <h2 className="text-4xl font-black text-foreground tracking-tight">
                            Upgrade to <span className="text-primary">Premium</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto">
                            Your trial has ended. Unlock the full potential of AI-driven investment analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-border pt-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Premium Features</h3>
                            <ul className="space-y-4">
                                {[
                                    { text: 'Unlimited Portfolio Analysis', icon: Shield },
                                    { text: 'Real-time ML Predictions', icon: Zap },
                                    { text: 'Deep Market Insights', icon: TrendingUp },
                                    { text: 'Priority AI Copilot Support', icon: Sparkles },
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-foreground font-medium">
                                        <div className="w-6 h-6 bg-[#00ff9d]/10 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-[#00ff9d]" />
                                        </div>
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-secondary/50 p-8 rounded-3xl border border-border text-center space-y-6">
                            <div>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Plan</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-4xl font-black text-foreground">₹299</span>
                                    <span className="text-muted-foreground font-medium">/mo</span>
                                </div>
                            </div>

                            <button
                                onClick={onSubscribe}
                                className="w-full py-4 bg-primary text-black font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all transform active:scale-95"
                            >
                                CONTINUE TO PREMIUM
                            </button>

                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                Secure Payment • Cancel Anytime
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
