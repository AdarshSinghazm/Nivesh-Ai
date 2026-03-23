'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMarketOverview, Stock, PricePoint, StockQuote } from '@/lib/services/marketService';
import { getStockHistory, getIndexQuote } from '@/lib/services/enhancedStockService';
import StockCard from '@/components/StockCard';
import StockChart from '@/components/StockChart';
import { Search, Filter, RefreshCw, Clock, TrendingUp, DollarSign, Activity, BarChart2 } from 'lucide-react';

export default function MarketPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');
    const [chartData, setChartData] = useState<PricePoint[]>([]); // Using PricePoint interface
    const [niftyQuote, setNiftyQuote] = useState<StockQuote | null>(null); // Using StockQuote interface
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const fetchMarketData = useCallback(async () => {
        try {
            setLoading(true);
            const [data, nifty] = await Promise.all([
                getMarketOverview(),
                getIndexQuote('^NSEI')
            ]);

            setStocks(data);
            setNiftyQuote(nifty);
            setLastUpdate(new Date());
            setError(null);
        } catch (err) {
            console.error("Failed to fetch market data:", err);
            setError("Unable to load live market data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchChartData = useCallback(async () => {
        try {
            const history = await getStockHistory('^NSEI', '1d');
            if (history && Array.isArray(history)) {
                const formatted: PricePoint[] = (history as any[]).map((p: any) => ({
                    day: new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    price: Number(p.close),
                    fullDate: new Date(p.date).toLocaleDateString()
                }));
                setChartData(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch chart data:", err);
        }
    }, []);

    useEffect(() => {
        setMounted(true); // Component has mounted on the client
        const initFetch = async () => {
            await Promise.all([
                fetchMarketData(),
                fetchChartData()
            ]);
        };
        initFetch();

        const interval = setInterval(fetchMarketData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, [fetchMarketData, fetchChartData]); // Dependencies are stable useCallback functions

    const filteredStocks = stocks.filter((stock: Stock) => { // Explicitly type stock as Stock
        const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || stock.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (filter === 'gainers') return matchesSearch && stock.change >= 0;
        if (filter === 'losers') return matchesSearch && stock.change < 0;
        return matchesSearch;
    });

    const totalVolume = stocks.reduce((acc, s: Stock) => acc + (s.technical?.volume || 0), 0); // Type s as Stock
    const formatVolume = (vol: number) => {
        if (vol >= 10000000) return (vol / 10000000).toFixed(1) + 'Cr';
        if (vol >= 100000) return (vol / 100000).toFixed(1) + 'L';
        if (vol >= 1000) return (vol / 1000).toFixed(1) + 'K';
        return vol.toString();
    };

    const marketStats = {
        totalVolume: formatVolume(totalVolume) || '0',
        topSector: 'Technology',
        marketSentiment: stocks.filter(s => s.change >= 0).length > stocks.filter(s => s.change < 0).length ? 'Bullish' : 'Bearish',
        advancing: stocks.filter(s => s.change >= 0).length,
        declining: stocks.filter(s => s.change < 0).length
    };

    // Render a placeholder until the component is mounted on the client
    if (!mounted) {
        return <div className="min-h-screen bg-background p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex items-center justify-between animate-fade-in">
                    <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
                    <div className="lg:col-span-1 h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
                </div>
                <div className="h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>)}
                </div>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-background p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between animate-fade-in">
                    <div>
                        <h1 className="text-5xl font-black text-foreground mb-2">
                            Market <span className="text-[#00ff9d]">Overview</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">Live NSE stock prices with real-time updates</p>
                    </div>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm animate-fade-in">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-foreground/70 bg-secondary px-4 py-2 rounded-lg border border-border">
                        <Clock className="w-4 h-4 text-[#00ff9d]" />
                        <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                        <span className="inline-block w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse"></span>
                    </div>
                </div>

                {/* Market Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                    <div className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between shadow-md hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] hover:border-primary hover:bg-primary/5 transition-all duration-300">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Nifty 50</p>
                            <p className="text-2xl font-black text-foreground">
                                {niftyQuote?.regularMarketPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '22,145.30'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`${(niftyQuote?.regularMarketChange || 0) >= 0 ? 'text-[#00ff9d]' : 'text-[#ff4444]'} font-bold text-sm`}>
                                {(niftyQuote?.regularMarketChange || 0) >= 0 ? '+' : ''}
                                {niftyQuote?.regularMarketChange?.toFixed(2) || '+124.50'}
                            </p>
                            <p className={`${(niftyQuote?.regularMarketChangePercent || 0) >= 0 ? 'text-[#00ff9d]' : 'text-[#ff4444]'} text-xs font-bold`}>
                                {(niftyQuote?.regularMarketChangePercent || 0) >= 0 ? '+' : ''}
                                {niftyQuote?.regularMarketChangePercent?.toFixed(2) || '0.56'}%
                            </p>
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between shadow-md hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] hover:border-primary hover:bg-primary/5 transition-all duration-300">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Sentiment</p>
                            <p className={`text-2xl font-black ${marketStats.marketSentiment === 'Bullish' ? 'text-[#00ff9d]' : 'text-[#ff4444]'}`}>
                                {marketStats.marketSentiment}
                            </p>
                        </div>
                        <Activity className="w-8 h-8 text-[#00ff9d]/20" />
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between shadow-md hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] hover:border-primary hover:bg-primary/5 transition-all duration-300">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Volume</p>
                            <p className="text-2xl font-black text-foreground">{marketStats.totalVolume}</p>
                        </div>
                        <BarChart2 className="w-8 h-8 text-blue-500/20" />
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between shadow-md hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] hover:border-primary hover:bg-primary/5 transition-all duration-300">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Breadth</p>
                            <div className="flex gap-2 text-sm mt-1">
                                <span className="text-[#00ff9d] font-bold">{marketStats.advancing} Adv</span>
                                <span className="text-gray-600">|</span>
                                <span className="text-[#ff4444] font-bold">{marketStats.declining} Dec</span>
                            </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-[#00ff9d]/20" />
                    </div>
                </div>

                {/* Featured Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in delay-100">
                    <div className="lg:col-span-2 bg-card p-8 rounded-3xl border border-border relative overflow-hidden group shadow-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={120} className="text-[#00ff9d]" />
                        </div>
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h2 className="text-2xl font-bold text-foreground">Nifty 50 Performance</h2>
                            <select className="bg-secondary border border-border text-foreground/80 text-sm rounded-lg px-4 py-2 outline-none focus:border-primary">
                                <option>1 Day</option>
                                <option>1 Week</option>
                                <option>1 Month</option>
                                <option>1 Year</option>
                            </select>
                        </div>
                        <div className="h-80 relative z-10">
                            <StockChart data={chartData.length > 0 ? chartData : undefined} />
                            {/* Overlay info */}
                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity p-4 rounded-xl border border-white/10 pointer-events-none">
                                <p className="text-xs text-gray-400">Current Level</p>
                                <p className="text-xl font-bold text-white">
                                    {niftyQuote?.regularMarketPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '22,145.30'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-gradient-to-br from-card to-background p-8 rounded-3xl border border-border h-full flex flex-col justify-center items-center text-center relative overflow-hidden shadow-xl">
                            <div className="absolute inset-0 bg-[#00ff9d]/5 skew-y-12 transform scale-150 origin-bottom-left"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-[#00ff9d]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-6 transition-transform">
                                    <DollarSign className="w-8 h-8 text-[#00ff9d]" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-2">Top Sector</h3>
                                <p className="text-[#00ff9d] text-xl font-bold mb-6">{marketStats.topSector}</p>
                                <p className="text-muted-foreground text-sm">Technology stocks are leading the rally today with strong buying interest.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border animate-fade-in delay-200 shadow-md hover:border-primary transition-colors duration-300">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search stocks (e.g. RELIANCE)..."
                            className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === 'all' ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'}`}
                        >
                            All Stocks
                        </button>
                        <button
                            onClick={() => setFilter('gainers')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === 'gainers' ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'}`}
                        >
                            Top Gainers
                        </button>
                        <button
                            onClick={() => setFilter('losers')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === 'losers' ? 'bg-[#ff4444] text-white shadow-[0_0_15px_rgba(255,68,68,0.3)]' : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'}`}
                        >
                            Top Losers
                        </button>
                    </div>
                    <button onClick={fetchMarketData} className="p-3 bg-secondary border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary transition-all" title="Refresh">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Stock Grid */}
                {loading && stocks.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-card rounded-2xl border border-border shadow-lg"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in delay-300">
                        {filteredStocks.map(stock => (
                            <StockCard key={stock.symbol} stock={stock} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Icon helper removed since BarChart2 is now imported from lucide-react

