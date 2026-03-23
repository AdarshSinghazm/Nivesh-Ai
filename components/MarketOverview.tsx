'use client';

import { useEffect, useState } from 'react';
import { Stock } from '@/lib/services/marketService';
import StockCard from './StockCard';
import dynamic from 'next/dynamic';
import { Activity } from 'lucide-react';

const StockChart = dynamic(() => import('./StockChart'), { ssr: false });

export default function MarketOverview() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/market');
                const data = await response.json();
                setStocks(data.stocks || []);
            } catch (error) {
                console.error('Failed to load market data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-[#00ff9d] border-t-transparent animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Market Overview</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full border border-border">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-sm font-medium text-muted-foreground">Live Updates</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stocks.map(stock => (
                    <StockCard key={stock.symbol} stock={stock} />
                ))}
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl text-foreground">Market Trends (Nifty 50)</h3>
                    <select className="bg-secondary border border-border text-muted-foreground text-sm rounded-lg px-3 py-1 outline-none focus:border-primary">
                        <option>1 Week</option>
                        <option>1 Month</option>
                        <option>3 Months</option>
                    </select>
                </div>
                <StockChart />
            </div>
        </div>
    );
}
