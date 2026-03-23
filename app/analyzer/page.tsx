'use client';

import { useState, useEffect } from 'react';
import { getMarketOverview } from '@/lib/services/marketService';
import {
    analyzePortfolio,
    enrichWithAI,
    enrichWithModel,
    HoldingInput,
    AnalyzerInput,
    AnalysisResult,
    Recommendation,
} from '@/lib/services/analyzerService';
import { RiskLevel, InvestmentGoal } from '@/lib/hooks/useUserProfile';
import { useSession } from 'next-auth/react';
import { checkSubscriptionStatus } from '@/lib/services/subscriptionService';
import PricingModal from '@/components/PricingModal';
import { ShoppingCart, TrendingDown, ArrowRight, Plus, Trash2, Target, Sparkles, X, BarChart3, Shield, Zap, Bot, Clock } from 'lucide-react';
import StockChart from '@/components/StockChart';
import { ModelPredictionCard } from '@/components/ModelPredictionCard';

type UserIntent = 'buy' | 'sell' | null;
type Step = 'intent' | 'form' | 'results';

export default function AnalyzerPage() {
    const [step, setStep] = useState<Step>('intent');
    const [intent, setIntent] = useState<UserIntent>(null);

    const { data: session, update: updateSession } = useSession();
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [subStatus, setSubStatus] = useState<{ isEligible: boolean; daysRemaining?: number; reason?: string } | null>(null);

    // Check subscription status on mount/session update
    useEffect(() => {
        if (session?.user) {
            const status = checkSubscriptionStatus(session.user);
            setSubStatus(status as { isEligible: boolean; daysRemaining?: number; reason?: string });
        }
    }, [session]);

    // Form state
    const [holdings, setHoldings] = useState<HoldingInput[]>([]);
    const [newHolding, setNewHolding] = useState({ symbol: '', quantity: '', averagePrice: '' });
    const [budget, setBudget] = useState('');
    const [riskTolerance, setRiskTolerance] = useState<RiskLevel>('medium');
    const [goal, setGoal] = useState<InvestmentGoal>('growth');
    const [timeHorizon, setTimeHorizon] = useState('10');

    // Analysis state
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

    const handleSubscribe = async () => {
        try {
            const response = await fetch('/api/user/subscribe', { method: 'POST' });
            if (response.ok) {
                await updateSession(); // Refresh session to get new paid status
                setIsPricingOpen(false);
            }
        } catch (error) {
            console.error("Failed to subscribe", error);
        }
    };

    // Derive the selected recommendation object from the latest analysis state
    const selectedRec = analysis?.recommendations.find((r: Recommendation) => r.stock.symbol === selectedRecId) || null;

    const handleIntentSelect = (selectedIntent: UserIntent) => {
        setIntent(selectedIntent);
        setStep('form');
    };

    const addHolding = () => {
        if (!newHolding.symbol || !newHolding.quantity || !newHolding.averagePrice) return;

        setHoldings([
            ...holdings,
            {
                symbol: newHolding.symbol.toUpperCase(),
                quantity: Number(newHolding.quantity),
                averagePrice: Number(newHolding.averagePrice),
            },
        ]);
        setNewHolding({ symbol: '', quantity: '', averagePrice: '' });
    };

    const removeHolding = (index: number) => {
        setHoldings(holdings.filter((_, i) => i !== index));
    };

    const handleAnalyze = async () => {
        // Subscription check
        if (subStatus && !subStatus.isEligible) {
            setIsPricingOpen(true);
            return;
        }

        if (intent === 'buy' && (!budget || Number(budget) <= 0)) {
            alert('Please enter a valid budget');
            return;
        }

        if (intent === 'sell' && holdings.length === 0) {
            alert('Please add at least one stock holding');
            return;
        }

        setLoading(true);
        const stocks = await getMarketOverview();

        const input: AnalyzerInput = {
            holdings: intent === 'sell' ? holdings : [],
            availableBudget: intent === 'buy' ? Number(budget) : 0,
            riskTolerance,
            goal,
            timeHorizonYears: Number(timeHorizon),
        };

        const result = analyzePortfolio(input, stocks);

        // Artificial delay for specific "Analyzing" feel
        setTimeout(async () => {
            setAnalysis(result);
            setStep('results');
            setLoading(false);

            // Trigger AI Enrichment & Model Predictions in parallel
            try {
                // 1. Get AI Text Summary
                const aiResultPromise = enrichWithAI(result, input);

                // 2. Get Custom Model Predictions (New)
                const modelResultPromise = enrichWithModel(result);

                const [aiResult, modelResult] = await Promise.all([aiResultPromise, modelResultPromise]);

                // Merge results
                setAnalysis({
                    ...aiResult,
                    recommendations: modelResult.recommendations
                });

            } catch (error) {
                console.error("AI Enrichment failed", error);
            } finally {
                setAiLoading(false);
            }
        }, 1500);
    };

    const reset = () => {
        setStep('intent');
        setIntent(null);
        setHoldings([]);
        setBudget('');
        setAnalysis(null);
        setSelectedRecId(null);
    };

    // Intent Selection Screen
    if (step === 'intent') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8 pt-20 transition-colors duration-300">
                <div className="max-w-5xl w-full animate-fade-in relative">
                    {/* Trial Banner */}
                    {subStatus && subStatus.reason === 'trial' && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary animate-bounce">
                            <Clock size={14} />
                            FREE TRIAL: {subStatus.daysRemaining} DAYS REMAINING
                        </div>
                    )}

                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center justify-center p-4 bg-[#00ff9d]/10 rounded-full mb-4 ring-1 ring-[#00ff9d]/30">
                            <Sparkles className="w-8 h-8 text-[#00ff9d]" />
                        </div>
                        <h1 className="text-6xl font-black text-foreground mb-4 tracking-tight">AI INVESTMENT <span className="text-primary">ASSISTANT</span></h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Let AI analyze your needs and help you make smarter investment decisions with personalized recommendations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button
                            onClick={() => handleIntentSelect('buy')}
                            className="group bg-card rounded-3xl border border-border p-10 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff9d]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                                <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-border group-hover:border-primary/50">
                                    <ShoppingCart className="w-10 h-10 text-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground mb-3">Find Stocks to Buy</h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Get personalized recommendations based on your budget and risk profile.
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-[#00ff9d] font-bold uppercase tracking-wider text-sm bg-[#00ff9d]/10 px-6 py-3 rounded-full group-hover:bg-[#00ff9d] group-hover:text-black transition-all">
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleIntentSelect('sell')}
                            className="group bg-card rounded-3xl border border-border p-10 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff9d]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                                <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-border group-hover:border-primary/50">
                                    <TrendingDown className="w-10 h-10 text-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground mb-3">Ask AI Assistant</h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Review your current portfolio and get AI advice on what to hold or sell.
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-[#00ff9d] font-bold uppercase tracking-wider text-sm bg-[#00ff9d]/10 px-6 py-3 rounded-full group-hover:bg-[#00ff9d] group-hover:text-black transition-all">
                                    ASK AI ASSISTANT <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Form Screen
    if (step === 'form') {
        return (
            <div className="min-h-screen bg-background p-8 transition-colors duration-300">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <button onClick={reset} className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors font-medium">← Back to Start</button>

                    <div className="bg-card rounded-3xl border border-border p-10 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff9d]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="mb-10 relative z-10">
                            <h1 className="text-4xl font-black text-foreground mb-3">{intent === 'buy' ? 'Find Stocks to Buy' : 'Ask AI Assistant'}</h1>
                            <p className="text-xl text-muted-foreground">{intent === 'buy' ? 'Tell us about your budget and preferences to get personalized recommendations.' : 'Enter your current holdings to see which stocks to keep or sell.'}</p>
                        </div>

                        <div className="space-y-8 relative z-10">
                            {intent === 'sell' && (
                                <div className="border border-border rounded-2xl p-6 bg-secondary">
                                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><div className="w-2 h-8 bg-primary rounded-full"></div>Your Current Holdings</h2>
                                    <div className="space-y-4 mb-6">
                                        <input type="text" placeholder="Stock Symbol" className="w-full p-4 bg-card border border-border rounded-xl text-foreground focus:border-primary outline-none transition-all placeholder-muted-foreground uppercase" value={newHolding.symbol} onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="number" placeholder="Quantity" className="w-full p-4 bg-card border border-border rounded-xl text-foreground focus:border-primary outline-none transition-all placeholder-muted-foreground" value={newHolding.quantity} onChange={(e) => setNewHolding({ ...newHolding, quantity: e.target.value })} />
                                            <input type="number" placeholder="Avg Price (₹)" className="w-full p-4 bg-card border border-border rounded-xl text-foreground focus:border-primary outline-none transition-all placeholder-muted-foreground" value={newHolding.averagePrice} onChange={(e) => setNewHolding({ ...newHolding, averagePrice: e.target.value })} />
                                        </div>
                                        <button onClick={addHolding} className="w-full bg-card hover:bg-muted text-foreground p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border border-border hover:border-primary"><Plus size={20} className="text-primary" /> Add Stock</button>
                                    </div>
                                    {holdings.length > 0 && (
                                        <div className="space-y-3">
                                            {holdings.map((holding, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors">
                                                    <div><p className="font-bold text-foreground text-lg">{holding.symbol}</p><p className="text-sm text-muted-foreground"><span className="text-foreground/80 font-medium">{holding.quantity}</span> shares @ <span className="text-foreground/80 font-medium">₹{holding.averagePrice}</span></p></div>
                                                    <button onClick={() => removeHolding(idx)} className="text-gray-500 hover:text-[#ff4444] p-2 hover:bg-[#ff4444]/10 rounded-lg transition-colors"><Trash2 size={20} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {intent === 'buy' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">How much money do you want to invest?</label>
                                    <div className="relative"><span className="absolute left-4 top-4 text-muted-foreground font-bold">₹</span><input type="number" placeholder="50000" className="w-full pl-8 p-4 bg-secondary border border-border rounded-xl text-foreground text-lg focus:border-primary outline-none transition-all placeholder-muted-foreground" value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Risk Tolerance</label>
                                <select className="w-full p-4 bg-secondary border border-border rounded-xl text-foreground focus:border-primary outline-none transition-all appearance-none" value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value as RiskLevel)}>
                                    <option value="low">Low - I prefer safe, stable investments</option>
                                    <option value="medium">Medium - I want a balanced approach</option>
                                    <option value="high">High - I&apos;m willing to take risks</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Investment Goal</label>
                                <select className="w-full p-4 bg-secondary border border-border rounded-xl text-foreground focus:border-primary outline-none transition-all appearance-none" value={goal} onChange={(e) => setGoal(e.target.value as InvestmentGoal)}>
                                    <option value="retirement">Retirement - Long term savings</option>
                                    <option value="growth">Growth - Wealth accumulation</option>
                                    <option value="income">Income - Regular dividends</option>
                                    <option value="speculation">Speculation - High risk/reward</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Time Horizon (Years)</label>
                                <input type="number" placeholder="10" className="w-full p-4 bg-secondary border border-border rounded-xl text-foreground focus:border-primary outline-none transition-all placeholder-muted-foreground" value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)} />
                            </div>

                            <button onClick={handleAnalyze} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-black p-5 rounded-xl font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all transform active:scale-95 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]">
                                {loading ? <div className="flex items-center gap-3"><div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div><span>ANALYZING MARKET...</span></div> : <><Target size={24} className="stroke-3" />{intent === 'buy' ? 'FIND BEST STOCKS' : 'ASK AI ASSISTANT'}</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen with Modal
    if (step === 'results' && analysis) {
        return (
            <div className="min-h-screen bg-background p-8 relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border pb-8">
                        <div>
                            <h1 className="text-4xl font-black text-foreground mb-2">Personalized Analysis</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">{analysis.summary}</p>
                        </div>
                        <button onClick={reset} className="px-6 py-3 bg-secondary hover:bg-muted text-foreground border border-border hover:border-primary rounded-xl font-bold transition-all">Start Over</button>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-8">Detailed Recommendations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {analysis.recommendations.slice(0, 8).map((rec: Recommendation, idx: number) => (
                                <div key={idx} className={`border rounded-2xl p-6 transition-all hover:scale-[1.02] ${rec.action === 'buy' ? 'border-primary/30 bg-primary/5' : rec.action === 'sell' ? 'border-[#ff4444]/30 bg-[#ff4444]/5' : 'border-border bg-secondary'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-2xl font-black text-foreground">{rec.stock.symbol}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${rec.action === 'buy' ? 'bg-primary text-black' : rec.action === 'sell' ? 'bg-[#ff4444] text-white' : 'bg-muted text-muted-foreground'}`}>{rec.action}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{rec.stock.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-foreground">₹{rec.stock.price.toFixed(2)}</p>
                                            {rec.projectedProfit && (
                                                <p className={`text-sm font-bold ${rec.projectedProfit > 0 ? 'text-primary' : 'text-[#ff4444]'}`}>{rec.projectedProfit > 0 ? '+' : ''}{rec.projectedProfit}% upside</p>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{rec.reasoning}</p>

                                    <button
                                        onClick={() => setSelectedRecId(rec.stock.symbol)}
                                        className="w-full py-3 rounded-xl font-bold bg-secondary border border-border text-foreground hover:bg-primary hover:text-black hover:border-transparent transition-all flex items-center justify-center gap-2"
                                    >
                                        <BarChart3 size={18} /> View Deep Analysis
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Deep Analysis Modal */}
                {selectedRec && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                        <div className="bg-[#0f172a] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl relative text-slate-100">
                            <button
                                onClick={() => setSelectedRecId(null)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full hover:bg-slate-700"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-8 md:p-12 space-y-8">
                                {/* Header */}
                                <div className="border-b border-slate-700 pb-8">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h2 className="text-5xl font-black text-white tracking-tight">{selectedRec.stock.symbol}</h2>
                                        <div className={`px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-widest ${selectedRec.action === 'buy' ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' : 'bg-[#ff4444] text-white shadow-[0_0_15px_rgba(255,68,68,0.3)]'}`}>{selectedRec.action} RECOMMENDED</div>
                                    </div>
                                    <p className="text-xl text-slate-400">{selectedRec.stock.name}</p>
                                </div>

                                {/* Why we chose this */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-sm font-black text-[#00ff9d] uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Target size={16} /> Why This Rank?
                                        </h3>
                                        <p className="text-slate-300 text-lg leading-relaxed mb-6">{selectedRec.reasoning}</p>

                                        <h3 className="text-sm font-black text-[#00ff9d] uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Shield size={16} /> How it Helps You
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">{selectedRec.details?.userAlignment}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Key Metrics</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                                                <span className="text-slate-400">Analyst Rating</span>
                                                <span className="text-white font-bold">{selectedRec.details?.analystRating}</span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                                                <span className="text-slate-400">Sector Trend</span>
                                                <span className={`font-bold ${selectedRec.details?.sectorTrend === 'Bullish' ? 'text-[#00ff9d]' : 'text-yellow-400'}`}>{selectedRec.details?.sectorTrend}</span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                                                <span className="text-slate-400">Volatility</span>
                                                <span className="text-white font-bold">{selectedRec.details?.volatility}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Confidence Score</span>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i <= (selectedRec.confidence === 'high' ? 5 : 3) ? 'bg-[#00ff9d]' : 'bg-slate-700'}`} />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Model Prediction */}
                                {selectedRec.modelPrediction && (
                                    <div className="mb-8">
                                        <h3 className="text-sm font-black text-[#00ff9d] uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Bot size={16} /> AI Model Analysis
                                        </h3>
                                        <ModelPredictionCard prediction={selectedRec.modelPrediction} />
                                    </div>
                                )}

                                {/* Chart Section */}
                                <div>
                                    <h3 className="text-sm font-black text-[#00ff9d] uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Zap size={16} /> 30-Day Price Trend
                                    </h3>
                                    <div className="h-64 bg-secondary rounded-2xl border border-border p-4">
                                        <StockChart
                                            data={selectedRec.modelPrediction?.historical_data?.prices
                                                ? selectedRec.modelPrediction.historical_data.prices.map((p, i) => ({
                                                    day: `Day ${i + 1}`,
                                                    price: Number(p.toFixed(2))
                                                }))
                                                : selectedRec.historicalData
                                            }
                                        />
                                    </div>
                                    <p className="text-center text-xs text-gray-600 mt-4 uppercase tracking-widest">
                                        {selectedRec.modelPrediction?.historical_data
                                            ? "* Real Historical Data tracked by AI Model"
                                            : "* Simulated historical data for demonstration"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Pricing Modal */}
                <PricingModal
                    isOpen={isPricingOpen}
                    onClose={() => setIsPricingOpen(false)}
                    onSubscribe={handleSubscribe}
                />
            </div>
        );
    }

    return (
        <PricingModal
            isOpen={isPricingOpen}
            onClose={() => setIsPricingOpen(false)}
            onSubscribe={handleSubscribe}
        />
    );
}
