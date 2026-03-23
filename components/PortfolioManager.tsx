'use client';

import { useState } from 'react';
import { useUserProfile, PortfolioItem } from '@/lib/hooks/useUserProfile';
import { Plus, Trash2, PieChart } from 'lucide-react';

export default function PortfolioManager() {
    const { profile, saveProfile, isLoaded } = useUserProfile();
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    if (!isLoaded) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 rounded-full border-2 border-[#00ff9d] border-t-transparent animate-spin"></div>
        </div>
    );

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!symbol || !quantity || !price) return;

        const newItem: PortfolioItem = {
            symbol: symbol.toUpperCase(),
            quantity: Number(quantity),
            averagePrice: Number(price),
        };

        const updatedPortfolio = [...(profile.portfolio || []), newItem];
        saveProfile({ ...profile, portfolio: updatedPortfolio });

        setSymbol('');
        setQuantity('');
        setPrice('');
    };

    const handleRemove = (index: number) => {
        const updatedPortfolio = [...profile.portfolio];
        updatedPortfolio.splice(index, 1);
        saveProfile({ ...profile, portfolio: updatedPortfolio });
    };

    return (
        <div className="bg-card p-6 rounded-2xl border border-border h-full flex flex-col hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.2)]">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">Your Portfolio</h3>
                </div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                    {profile.portfolio?.length || 0} Assets
                </span>
            </div>

            {/* Add New Stock Form */}
            <form onSubmit={handleAdd} className="space-y-4 mb-8 p-5 bg-secondary rounded-xl border border-border">
                <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Symbol</label>
                    <input
                        type="text"
                        placeholder="e.g. RELIANCE"
                        className="w-full p-3 bg-card border border-border rounded-lg text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-muted-foreground uppercase"
                        value={symbol}
                        onChange={e => setSymbol(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Qty</label>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full p-3 bg-card border border-border rounded-lg text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-muted-foreground"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Avg Price</label>
                        <input
                            type="number"
                            placeholder="₹"
                            className="w-full p-3 bg-card border border-border rounded-lg text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-muted-foreground"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-black p-3 rounded-lg text-sm font-bold transition-all flex justify-center items-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,157,0.3)] transform active:scale-95"
                >
                    <Plus size={18} className="stroke-3" /> ADD ASSET
                </button>
            </form>

            {/* Holdings List */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
                {(profile.portfolio || []).length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center opacity-50">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                            <Plus size={32} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Start building your portfolio</p>
                    </div>
                ) : (
                    (profile.portfolio || []).map((item, idx) => (
                        <div key={idx} className="group flex justify-between items-center p-4 bg-secondary hover:bg-primary/10 rounded-xl border border-border hover:border-primary transition-all">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-foreground text-base">{item.symbol}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    <span className="font-bold text-foreground/80">{item.quantity}</span> shares • Avg <span className="font-bold text-foreground/80">₹{item.averagePrice}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemove(idx)}
                                className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Remove stock"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
