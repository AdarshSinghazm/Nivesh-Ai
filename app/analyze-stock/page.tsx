'use client';

import { useState, useEffect } from 'react';
import { EnhancedStock } from '@/lib/services/enhancedStockService';
import { analyzeStock, StockAnalysisInput, StockAnalysisResult } from '@/lib/services/advancedAnalyzerService';
import { getAllEnhancedStocks } from '@/lib/services/enhancedStockService';
import { getMockPrediction } from '@/lib/data/mockPredictions';
import { type ThemeProviderProps } from 'next-themes';
import PricePrediction from '@/components/PricePrediction';
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle, Info, BarChart3, ShieldCheck } from 'lucide-react';

export default function AdvancedAnalyzerPage() {
    const [step, setStep] = useState<'form' | 'results'>('form');
    const [result, setResult] = useState<StockAnalysisResult | null>(null);

    // Form state
    const [symbol, setSymbol] = useState('');
    const [shares, setShares] = useState('');
    const [avgBuyPrice, setAvgBuyPrice] = useState('');
    const [investmentType, setInvestmentType] = useState<StockAnalysisInput['investmentType']>('long_term');
    const [investmentHorizon, setInvestmentHorizon] = useState<StockAnalysisInput['investmentHorizon']>('1-3_years');
    const [riskTolerance, setRiskTolerance] = useState<StockAnalysisInput['riskTolerance']>('moderate');
    const [goal, setGoal] = useState<StockAnalysisInput['goal']>('wealth_growth');
    const [targetPrice, setTargetPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [totalPortfolio, setTotalPortfolio] = useState('');

    const [availableStocks, setAvailableStocks] = useState<EnhancedStock[]>([]);

    useEffect(() => {
        getAllEnhancedStocks().then(setAvailableStocks);
    }, []);

    const handleAnalyze = async () => {
        if (!symbol || !shares || !avgBuyPrice) {
            alert('Please fill in all required fields');
            return;
        }

        const input: StockAnalysisInput = {
            symbol: symbol.toUpperCase(),
            shares: Number(shares),
            avgBuyPrice: Number(avgBuyPrice),
            investmentType,
            investmentHorizon,
            riskTolerance,
            goal,
            targetPrice: targetPrice ? Number(targetPrice) : undefined,
            stopLoss: stopLoss ? Number(stopLoss) : undefined,
            totalPortfolioValue: totalPortfolio ? Number(totalPortfolio) : undefined,
        };

        const analysis = await analyzeStock(input);
        if (analysis) {
            setResult(analysis);
            setStep('results');
        } else {
            alert('Stock not found. Available: RELIANCE, TCS, INFY, HDFCBANK, TATAMOTORS');
        }
    };

    const getRecommendationColor = (rec: string) => {
        switch (rec) {
            case 'strong_hold': return 'bg-gradient-to-br from-[#00ff9d] to-[#00e5a0] text-black';
            case 'hold': return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white';
            case 'review_partial_sell': return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black';
            case 'sell': return 'bg-gradient-to-br from-red-500 to-red-600 text-white';
            default: return 'bg-[#1a1a1a] text-gray-400';
        }
    };

    const getRecommendationText = (rec: string) => {
        switch (rec) {
            case 'strong_hold': return 'STRONG HOLD';
            case 'hold': return 'HOLD';
            case 'review_partial_sell': return 'REVIEW / PARTIAL SELL';
            case 'sell': return 'SELL';
            default: return 'UNKNOWN';
        }
    };

    if (step === 'results' && result) {
        return (
            <div className="min-h-screen bg-black p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between animate-fade-in">
                        <div>
                            <h1 className="text-5xl font-black text-white mb-2">
                                {result.stock.symbol} <span className="text-[#00ff9d]">Analysis</span>
                            </h1>
                            <p className="text-gray-400 text-lg">{result.stock.name}</p>
                        </div>
                        <button
                            onClick={() => setStep('form')}
                            className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] hover:border-[#00ff9d] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.2)]"
                        >
                            Analyze Another Stock
                        </button>
                    </div>

                    {/* Recommendation Card */}
                    <div className={`${getRecommendationColor(result.recommendation)} rounded-2xl shadow-2xl p-8 border-2 border-white/10 animate-fade-in`}>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-5xl font-black mb-2 tracking-tight">{getRecommendationText(result.recommendation)}</h2>
                                <p className="text-xl font-bold opacity-90 flex items-center gap-2">
                                    <ShieldCheck className="w-6 h-6" />
                                    Confidence: {result.confidence.toUpperCase()}
                                </p>
                            </div>
                            <div className="text-right bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Overall Score</p>
                                <p className="text-6xl font-black">{(result.scores.total * 5).toFixed(0)}/100</p>
                            </div>
                        </div>
                        <p className="text-xl font-medium leading-relaxed max-w-4xl opacity-95">{result.detailedAnalysis.whyThisDecision.join(' ')}</p>
                    </div>

                    {/* Position Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 hover:border-[#00ff9d] transition-all duration-300 group">
                            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-bold group-hover:text-[#00ff9d] transition-colors">Current Price</p>
                            <p className="text-4xl font-black text-white">₹{result.stock.price.toFixed(2)}</p>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 hover:border-[#00ff9d] transition-all duration-300 group">
                            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-bold group-hover:text-[#00ff9d] transition-colors">Investment</p>
                            <p className="text-4xl font-black text-white">₹{(result.input.shares * result.input.avgBuyPrice).toFixed(0)}</p>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 hover:border-[#00ff9d] transition-all duration-300 group">
                            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-bold group-hover:text-[#00ff9d] transition-colors">Current Value</p>
                            <p className="text-4xl font-black text-white">₹{result.currentValue.toFixed(0)}</p>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 hover:border-[#00ff9d] transition-all duration-300 group">
                            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-bold group-hover:text-[#00ff9d] transition-colors">P&L</p>
                            <p className={`text-4xl font-black ${result.profitLoss >= 0 ? 'text-[#00ff9d]' : 'text-[#ff4444]'}`}>
                                {result.profitLoss >= 0 ? '+' : ''}₹{result.profitLoss.toFixed(0)}
                            </p>
                            <p className={`text-sm font-bold mt-1 ${result.profitLoss >= 0 ? 'text-[#00ff9d]' : 'text-[#ff4444]'}`}>
                                ({result.profitLoss >= 0 ? '+' : ''}{result.profitLossPercent.toFixed(2)}%)
                            </p>
                        </div>
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 hover:border-[#00ff9d] transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-[#00ff9d] transition-colors">Technical Score</h3>
                                <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-[#00ff9d] transition-colors" />
                            </div>
                            <div className="flex items-end gap-2 mb-4">
                                <p className="text-6xl font-black text-[#00ff9d]">{(result.scores.technical * 20).toFixed(0)}</p>
                                <p className="text-2xl font-bold text-gray-500 mb-1.5">/100</p>
                            </div>
                            <div className="w-full bg-[#0a0a0a] rounded-full h-3 border border-[#2a2a2a]">
                                <div className="bg-[#00ff9d] h-3 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,255,157,0.5)]" style={{ width: `${result.scores.technical * 20}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 hover:border-[#00ff9d] transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-[#00ff9d] transition-colors">Fundamental Score</h3>
                                <Target className="w-6 h-6 text-gray-600 group-hover:text-[#00ff9d] transition-colors" />
                            </div>
                            <div className="flex items-end gap-2 mb-4">
                                <p className="text-6xl font-black text-[#00ff9d]">{(result.scores.fundamental * 20).toFixed(0)}</p>
                                <p className="text-2xl font-bold text-gray-500 mb-1.5">/100</p>
                            </div>
                            <div className="w-full bg-[#0a0a0a] rounded-full h-3 border border-[#2a2a2a]">
                                <div className="bg-[#00ff9d] h-3 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,255,157,0.5)]" style={{ width: `${result.scores.fundamental * 20}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 hover:border-[#ff4444] transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-[#ff4444] transition-colors">Risk Score</h3>
                                <AlertCircle className="w-6 h-6 text-gray-600 group-hover:text-[#ff4444] transition-colors" />
                            </div>
                            <div className="flex items-end gap-2 mb-4">
                                <p className="text-6xl font-black text-[#ff4444]">{(result.scores.risk * 20).toFixed(0)}</p>
                                <p className="text-2xl font-bold text-gray-500 mb-1.5">/100</p>
                            </div>
                            <div className="w-full bg-[#0a0a0a] rounded-full h-3 border border-[#2a2a2a]">
                                <div className="bg-[#ff4444] h-3 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,68,68,0.5)]" style={{ width: `${result.scores.risk * 20}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Items */}
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 animate-fade-in hover:border-[#00ff9d] transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="w-8 h-8 text-[#00ff9d]" />
                            <h3 className="text-3xl font-black text-white">Action Items</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.detailedAnalysis.whyThisDecision.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 bg-[#0a0a0a] p-5 rounded-xl border border-[#2a2a2a] hover:border-[#00ff9d] transition-colors group">
                                    <div className="w-6 h-6 rounded-full bg-[#00ff9d]/20 text-[#00ff9d] flex items-center justify-center font-bold text-sm shrink-0 border border-[#00ff9d]/30 group-hover:bg-[#00ff9d] group-hover:text-black transition-colors">
                                        {idx + 1}
                                    </div>
                                    <p className="text-gray-300 font-medium text-lg">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                        {/* Technical Analysis */}
                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 hover:border-[#00ff9d] transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="w-6 h-6 text-[#00ff9d]" />
                                <h3 className="text-2xl font-black text-white">Technical Analysis</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Trend</p>
                                    <p className="text-lg text-white font-medium pl-4 border-l-2 border-[#00ff9d]">{result.detailedAnalysis.technicalAnalysis.trend}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Support & Resistance</p>
                                    <p className="text-lg text-white font-medium pl-4 border-l-2 border-[#00ff9d]">{result.detailedAnalysis.technicalAnalysis.supportResistance}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Momentum</p>
                                    <p className="text-lg text-white font-medium pl-4 border-l-2 border-[#00ff9d]">{result.detailedAnalysis.technicalAnalysis.momentum}</p>
                                </div>
                            </div>
                        </div>

                        {/* Fundamental Analysis */}
                        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 hover:border-[#00ff9d] transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="w-6 h-6 text-[#00ff9d]" />
                                <h3 className="text-2xl font-black text-white">Fundamental Analysis</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Valuation</p>
                                    <p className="text-lg text-white font-medium pl-4 border-l-2 border-[#00ff9d]">{result.detailedAnalysis.fundamentalAnalysis.valuation}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Growth</p>
                                    <p className="text-lg text-white font-medium pl-4 border-l-2 border-[#00ff9d]">{result.detailedAnalysis.fundamentalAnalysis.growth}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Financial Health</p>
                                    <p className="text-lg text-white font-medium pl-4 border-l-2 border-[#00ff9d]">{result.detailedAnalysis.fundamentalAnalysis.financialHealth}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ML Price Predictions */}
                    {getMockPrediction(result.stock.symbol) && (
                        <PricePrediction prediction={getMockPrediction(result.stock.symbol)!} />
                    )}

                    {/* Portfolio Impact */}
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 animate-fade-in hover:border-[#00ff9d] transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <Info className="w-6 h-6 text-[#00ff9d]" />
                            <h3 className="text-2xl font-black text-white">Portfolio Impact</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-[#2a2a2a] hover:border-yellow-500/50 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                    <span className="font-bold text-white">Concentration</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">{result.detailedAnalysis.portfolioImpact.concentration}</p>
                            </div>
                            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-[#2a2a2a] hover:border-blue-500/50 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-5 h-5 text-blue-500" />
                                    <span className="font-bold text-white">Diversification</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">{result.detailedAnalysis.portfolioImpact.diversification}</p>
                            </div>
                            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-[#2a2a2a] hover:border-orange-500/50 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    <span className="font-bold text-white">Risk Assessment</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">{result.detailedAnalysis.portfolioImpact.riskAssessment}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Form Screen
    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center animate-fade-in">
                    <h1 className="text-5xl font-black text-white mb-4">
                        Advanced Stock <span className="text-[#00ff9d]">Analyzer</span>
                    </h1>
                    <p className="text-xl text-gray-400">Professional NSE stock analysis with technical & fundamental insights</p>
                </div>

                <div className="bg-[#1a1a1a] rounded-3xl wireframe-glow border border-[#2a2a2a] p-8 md:p-12 space-y-10 shadow-2xl animate-fade-in">
                    {/* Stock Selection */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[#00ff9d]/10 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-[#00ff9d]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Stock Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">NSE Stock Symbol</label>
                                <select
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all appearance-none"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                >
                                    <option value="" className="bg-[#1a1a1a]">Select a stock</option>
                                    {availableStocks.map(stock => (
                                        <option key={stock.symbol} value={stock.symbol} className="bg-[#1a1a1a]">
                                            {stock.symbol} - {stock.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Number of Shares</label>
                                <input
                                    type="number"
                                    placeholder="100"
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all placeholder-gray-500"
                                    value={shares}
                                    onChange={(e) => setShares(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Average Buy Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="2400"
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all placeholder-gray-500"
                                    value={avgBuyPrice}
                                    onChange={(e) => setAvgBuyPrice(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Total Portfolio Value (₹)</label>
                                <input
                                    type="number"
                                    placeholder="500000"
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all placeholder-gray-500"
                                    value={totalPortfolio}
                                    onChange={(e) => setTotalPortfolio(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Investment Profile */}
                    <div className="pt-8 border-t border-[#2a2a2a]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[#00ff9d]/10 rounded-xl">
                                <Target className="w-6 h-6 text-[#00ff9d]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Investment Profile</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Investment Type</label>
                                <select
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all appearance-none"
                                    value={investmentType}
                                    onChange={(e) => setInvestmentType(e.target.value as any)}
                                >
                                    <option value="intraday">Intraday Trading</option>
                                    <option value="swing">Swing (Days-Weeks)</option>
                                    <option value="positional">Positional (1-6 Months)</option>
                                    <option value="long_term">Long-term (1+ Year)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Investment Horizon</label>
                                <select
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all appearance-none"
                                    value={investmentHorizon}
                                    onChange={(e) => setInvestmentHorizon(e.target.value as any)}
                                >
                                    <option value="<3_months">&lt; 3 Months</option>
                                    <option value="3-12_months">3-12 Months</option>
                                    <option value="1-3_years">1-3 Years</option>
                                    <option value="3+_years">3+ Years</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Risk Tolerance</label>
                                <select
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all appearance-none"
                                    value={riskTolerance}
                                    onChange={(e) => setRiskTolerance(e.target.value as any)}
                                >
                                    <option value="conservative">Conservative - Safe investments</option>
                                    <option value="moderate">Moderate - Balanced approach</option>
                                    <option value="aggressive">Aggressive - High risk/reward</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Investment Goal</label>
                                <select
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all appearance-none"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value as any)}
                                >
                                    <option value="trading">Trading - Short-term gains</option>
                                    <option value="wealth_growth">Wealth Growth - Long-term</option>
                                    <option value="dividend_income">Dividend Income</option>
                                    <option value="retirement">Retirement Planning</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Exit Strategy */}
                    <div className="pt-8 border-t border-[#2a2a2a]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[#00ff9d]/10 rounded-xl">
                                <ShieldCheck className="w-6 h-6 text-[#00ff9d]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Exit Strategy (Optional)</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Target Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="2800"
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all placeholder-gray-500"
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Stop Loss (₹)</label>
                                <input
                                    type="number"
                                    placeholder="2200"
                                    className="w-full p-4 bg-[#2a2a2a] border border-[#444] rounded-xl text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none transition-all placeholder-gray-500"
                                    value={stopLoss}
                                    onChange={(e) => setStopLoss(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        className="w-full bg-[#00ff9d] hover:bg-[#00e5a0] text-black p-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,157,0.4)]"
                    >
                        <Target size={24} className="stroke-2" />
                        ANALYZE STOCK
                    </button>
                </div>
            </div>
        </div>
    );
}
