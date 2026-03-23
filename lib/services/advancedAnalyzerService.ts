import { EnhancedStock, getEnhancedStockData } from './enhancedStockService';

export interface StockAnalysisInput {
    symbol: string;
    shares: number;
    avgBuyPrice: number;
    purchaseDate?: string;

    // Investment profile
    investmentType: 'intraday' | 'swing' | 'positional' | 'long_term';
    investmentHorizon: '<3_months' | '3-12_months' | '1-3_years' | '3+_years';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    goal: 'trading' | 'wealth_growth' | 'dividend_income' | 'retirement';

    // Exit strategy
    targetPrice?: number;
    stopLoss?: number;
    expectedReturn?: number;

    // Portfolio context
    totalPortfolioValue?: number;
    sectorExposure?: Record<string, number>;
}

export interface AnalysisScores {
    technical: number; // 0-5
    fundamental: number; // 0-5
    momentum: number; // 0-5
    risk: number; // 0-5
    total: number; // 0-20
}

export interface DetailedAnalysis {
    technicalAnalysis: {
        trend: string;
        rsiAnalysis: string;
        maAnalysis: string;
        supportResistance: string;
        momentum: string;
        volumeAnalysis: string;
    };
    fundamentalAnalysis: {
        valuation: string;
        growth: string;
        financialHealth: string;
        dividends: string;
    };
    portfolioImpact: {
        concentration: string;
        diversification: string;
        riskAssessment: string;
    };
    whyThisDecision: string[];
}

export interface StockAnalysisResult {
    stock: EnhancedStock;
    input: StockAnalysisInput;
    recommendation: 'strong_hold' | 'hold' | 'review_partial_sell' | 'sell';
    confidence: 'high' | 'medium' | 'low';
    scores: AnalysisScores;
    currentValue: number;
    profitLoss: number;
    profitLossPercent: number;
    detailedAnalysis: DetailedAnalysis;
}

/**
 * Calculate technical score (0-5)
 */
function calculateTechnicalScore(stock: EnhancedStock): number {
    let score = 0;
    const tech = stock.technical;

    // Trend (0-1.5)
    if (tech.trend === 'bullish' && stock.price > tech.ma200) score += 1.5;
    else if (tech.trend === 'neutral') score += 0.75;

    // RSI (0-1.5)
    if (tech.rsi >= 40 && tech.rsi <= 60) score += 1.5; // Healthy range
    else if (tech.rsi > 60 && tech.rsi < 70) score += 1.0; // Slightly overbought
    else if (tech.rsi > 30 && tech.rsi < 40) score += 1.0; // Slightly oversold
    else if (tech.rsi >= 70) score += 0.3; // Overbought
    else score += 0.5; // Oversold

    // Moving averages (0-1)
    if (stock.price > tech.ma50 && tech.ma50 > tech.ma200) score += 1.0; // Golden cross
    else if (stock.price > tech.ma200) score += 0.5;

    // Price position (0-1)
    const priceRange = tech.weekHigh52 - tech.weekLow52;
    const pricePosition = (stock.price - tech.weekLow52) / priceRange;
    if (pricePosition >= 0.4 && pricePosition <= 0.7) score += 1.0; // Sweet spot
    else if (pricePosition > 0.7) score += 0.3; // Near high
    else score += 0.5; // Near low

    return Math.min(5, score);
}

/**
 * Calculate fundamental score (0-5)
 */
function calculateFundamentalScore(stock: EnhancedStock, investmentType: string): number {
    if (investmentType === 'intraday' || investmentType === 'swing') {
        return 2.5; // Fundamentals less important for short-term
    }

    let score = 0;
    const fund = stock.fundamental;

    // Valuation (0-1.5)
    if (fund.peRatio < fund.sectorPE * 0.9) score += 1.5; // Undervalued
    else if (fund.peRatio <= fund.sectorPE * 1.1) score += 1.0; // Fair value
    else if (fund.peRatio <= fund.sectorPE * 1.3) score += 0.5; // Slightly overvalued

    // Growth (0-1.5)
    if (fund.revenueGrowth > 15 && fund.earningsGrowth > 15) score += 1.5;
    else if (fund.revenueGrowth > 10 || fund.earningsGrowth > 10) score += 1.0;
    else if (fund.revenueGrowth > 5) score += 0.5;

    // Financial health (0-1)
    if (fund.debtToEquity < 0.5) score += 1.0;
    else if (fund.debtToEquity < 1.0) score += 0.5;

    // Profitability (0-1)
    if (fund.roe > 20) score += 1.0;
    else if (fund.roe > 15) score += 0.7;
    else if (fund.roe > 10) score += 0.4;

    return Math.min(5, score);
}

/**
 * Calculate momentum score (0-5)
 */
function calculateMomentumScore(stock: EnhancedStock): number {
    let score = 0;

    // Price momentum (0-2)
    if (stock.changePercent > 2) score += 2.0;
    else if (stock.changePercent > 0) score += 1.5;
    else if (stock.changePercent > -2) score += 0.5;

    // Sentiment (0-2)
    const sent = stock.sentiment;
    if (sent.analystRating === 'strong_buy') score += 2.0;
    else if (sent.analystRating === 'buy') score += 1.5;
    else if (sent.analystRating === 'hold') score += 1.0;
    else if (sent.analystRating === 'sell') score += 0.3;

    // FII/DII activity (0-1)
    if (sent.fiiActivity === 'buying' && sent.diiActivity === 'buying') score += 1.0;
    else if (sent.fiiActivity === 'buying' || sent.diiActivity === 'buying') score += 0.7;
    else if (sent.fiiActivity === 'neutral' && sent.diiActivity === 'neutral') score += 0.5;

    return Math.min(5, score);
}

/**
 * Calculate risk score (0-5)
 */
function calculateRiskScore(
    stock: EnhancedStock,
    input: StockAnalysisInput,
    currentValue: number
): number {
    let score = 5; // Start with max, deduct for risks

    // Portfolio concentration risk
    if (input.totalPortfolioValue) {
        const allocation = (currentValue / input.totalPortfolioValue) * 100;
        if (allocation > 40) score -= 2.0; // Very high concentration
        else if (allocation > 25) score -= 1.0; // High concentration
        else if (allocation > 15) score -= 0.5; // Moderate concentration
    }

    // Stop-loss proximity
    if (input.stopLoss) {
        const distanceToStopLoss = ((stock.price - input.stopLoss) / stock.price) * 100;
        if (distanceToStopLoss < 5) score -= 1.5; // Very close to stop loss
        else if (distanceToStopLoss < 10) score -= 0.7;
    }

    // Volatility (based on 52-week range)
    const volatility = ((stock.technical.weekHigh52 - stock.technical.weekLow52) / stock.technical.weekLow52) * 100;
    if (volatility > 50) score -= 1.0;
    else if (volatility > 30) score -= 0.5;

    // Risk rating
    if (stock.riskRating === 'high' && input.riskTolerance === 'conservative') score -= 1.0;

    return Math.max(0, score);
}

/**
 * Generate detailed analysis
 */
function generateDetailedAnalysis(
    stock: EnhancedStock,
    input: StockAnalysisInput,
    scores: AnalysisScores
): DetailedAnalysis {
    const tech = stock.technical;
    const fund = stock.fundamental;
    const sent = stock.sentiment;

    const reasons: string[] = [];

    const detailedAnalysis: DetailedAnalysis = {
        technicalAnalysis: {
            trend: `Short-term trend is ${tech.trend.toUpperCase()}. Position relative to 200 DMA is ${stock.price > tech.ma200 ? 'positive' : 'negative'}.`,
            rsiAnalysis: `RSI is at ${tech.rsi.toFixed(1)}, indicating ${tech.rsi > 70 ? 'overbought' : tech.rsi < 30 ? 'oversold' : 'neutral'} conditions.`,
            maAnalysis: `Price is ${stock.price > tech.ma50 ? 'above' : 'below'} 50 DMA (₹${tech.ma50.toFixed(0)}) and ${stock.price > tech.ma200 ? 'above' : 'below'} 200 DMA (₹${tech.ma200.toFixed(0)}).`,
            momentum: scores.momentum >= 4 ? 'Strong bullish momentum' : scores.momentum >= 2.5 ? 'Improving momentum' : 'Weak momentum',
            volumeAnalysis: tech.volume > 1000000 ? 'High trading volume' : 'Moderate volume',
            supportResistance: `Support at ₹${tech.support.toFixed(2)}, Resistance at ₹${tech.resistance.toFixed(2)}`
        },
        fundamentalAnalysis: {
            valuation: `P/E ratio is ${fund.peRatio.toFixed(1)} vs sector average of ${fund.sectorPE.toFixed(1)}. ${fund.peRatio < fund.sectorPE ? 'Stock is undervalued relative to peers' : fund.peRatio > fund.sectorPE * 1.2 ? 'Stock appears overvalued' : 'Fair valuation'}.`,
            growth: `Revenue growing at ${fund.revenueGrowth.toFixed(1)}% and earnings at ${fund.earningsGrowth.toFixed(1)}%. ${fund.earningsGrowth > 15 ? 'Strong growth trajectory' : fund.earningsGrowth > 0 ? 'Moderate growth' : 'Declining earnings - red flag'}.`,
            financialHealth: `Debt-to-Equity: ${fund.debtToEquity.toFixed(2)}. ${fund.debtToEquity < 0.5 ? 'Excellent balance sheet with low debt' : fund.debtToEquity < 1 ? 'Healthy debt levels' : 'High debt - monitor closely'}. ROE: ${fund.roe.toFixed(1)}%.`,
            dividends: fund.dividendYield > 0 ? `Dividend yield of ${fund.dividendYield.toFixed(2)}% provides ${fund.dividendYield > 2 ? 'attractive' : 'modest'} passive income.` : 'No dividend - growth-focused company.'
        },
        // Portfolio Impact
        portfolioImpact: {
            concentration: '', // Will be filled below
            diversification: '', // Will be filled below
            riskAssessment: '' // Will be filled below
        },
        whyThisDecision: reasons // Will be filled below
    };

    const currentValue = input.shares * stock.price;
    const allocation = input.totalPortfolioValue ? (currentValue / input.totalPortfolioValue) * 100 : 0;

    detailedAnalysis.portfolioImpact.concentration = allocation > 0 ? `This stock represents ${allocation.toFixed(1)}% of your portfolio. ${allocation > 25 ? 'HIGH concentration risk - consider reducing exposure' : allocation > 15 ? 'Moderate concentration' : 'Well-diversified position'}.` : 'Portfolio data not provided.';
    detailedAnalysis.portfolioImpact.diversification = `Sector: ${stock.sector}. ${allocation > 30 ? 'Over-concentrated in this sector' : 'Sector allocation appears balanced'}.`;
    detailedAnalysis.portfolioImpact.riskAssessment = `Risk rating: ${stock.riskRating.toUpperCase()}. ${stock.riskRating === input.riskTolerance.replace('conservative', 'low').replace('moderate', 'medium').replace('aggressive', 'high') ? 'Matches your risk profile' : 'Misaligned with your risk tolerance'}.`;


    // Why this decision
    if (scores.total >= 16) {
        reasons.push(`Strong overall score (${scores.total}/20) indicates excellent fundamentals and technicals`);
        if (tech.trend === 'bullish') reasons.push('Bullish trend with price above key moving averages');
        if (fund.peRatio < fund.sectorPE) reasons.push(`Undervalued with P/E of ${fund.peRatio.toFixed(1)} vs sector ${fund.sectorPE.toFixed(1)}`);
        if (sent.analystRating === 'strong_buy' || sent.analystRating === 'buy') reasons.push('Positive analyst ratings support holding');
    } else if (scores.total >= 11) {
        reasons.push(`Moderate score (${scores.total}/20) suggests holding with close monitoring`);
        if (tech.rsi > 60) reasons.push('RSI showing some overbought conditions - watch for pullback');
        if (fund.revenueGrowth < 10) reasons.push('Growth metrics are moderate - not exceptional');
    } else if (scores.total >= 6) {
        reasons.push(`Below-average score (${scores.total}/20) warrants review`);
        if (tech.trend === 'bearish') reasons.push('Bearish trend indicates weakness - consider reducing position');
        if (fund.peRatio > fund.sectorPE * 1.2) reasons.push(`Overvalued at P/E ${fund.peRatio.toFixed(1)} vs sector ${fund.sectorPE.toFixed(1)}`);
        if (allocation > 25) reasons.push(`High portfolio concentration (${allocation.toFixed(1)}%) adds risk`);
    } else {
        reasons.push(`Poor score (${scores.total}/20) suggests selling`);
        if (tech.rsi < 40 && tech.trend === 'bearish') reasons.push('Weak technicals with bearish momentum');
        if (fund.earningsGrowth < 0) reasons.push(`Declining earnings (${fund.earningsGrowth.toFixed(1)}%) is a major red flag`);
        if (sent.fiiActivity === 'selling') reasons.push('Foreign institutional investors are selling - negative signal');
    }

    return detailedAnalysis;
}

/**
 * Main analysis function
 */
export async function analyzeStock(
    input: StockAnalysisInput
): Promise<StockAnalysisResult | null> {
    const stock = await getEnhancedStockData(input.symbol);
    if (!stock) return null;

    // Calculate current position
    const currentValue = input.shares * stock.price;
    const investedValue = input.shares * input.avgBuyPrice;
    const profitLoss = currentValue - investedValue;
    const profitLossPercent = (profitLoss / investedValue) * 100;

    // Calculate scores
    const technicalScore = calculateTechnicalScore(stock);
    const fundamentalScore = calculateFundamentalScore(stock, input.investmentType);
    const momentumScore = calculateMomentumScore(stock);
    const riskScore = calculateRiskScore(stock, input, currentValue);
    const totalScore = technicalScore + fundamentalScore + momentumScore + riskScore;

    const scores: AnalysisScores = {
        technical: technicalScore,
        fundamental: fundamentalScore,
        momentum: momentumScore,
        risk: riskScore,
        total: totalScore
    };

    // Determine recommendation
    let recommendation: StockAnalysisResult['recommendation'];
    let confidence: StockAnalysisResult['confidence'];

    if (totalScore >= 16) {
        recommendation = 'strong_hold';
        confidence = 'high';
    } else if (totalScore >= 11) {
        recommendation = 'hold';
        confidence = 'medium';
    } else if (totalScore >= 6) {
        recommendation = 'review_partial_sell';
        confidence = 'medium';
    } else {
        recommendation = 'sell';
        confidence = 'high';
    }

    // Generate detailed analysis
    const detailedAnalysis = generateDetailedAnalysis(stock, input, scores);

    return {
        stock,
        input,
        recommendation,
        confidence,
        scores,
        currentValue,
        profitLoss,
        profitLossPercent,
        detailedAnalysis
    };
}
