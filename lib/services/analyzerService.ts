import { Stock, PricePoint } from '../types';
import { RiskLevel, InvestmentGoal } from '../hooks/useUserProfile';
import { getRecommendations } from './recommendationService';
import { generatePortfolioInsight } from './aiChatService';
import { getCustomPrediction, PredictionResult } from './copilotService';

export interface HoldingInput {
    symbol: string;
    quantity: number;
    averagePrice: number;
}

export interface AnalyzerInput {
    holdings: HoldingInput[];
    availableBudget: number;
    riskTolerance: RiskLevel;
    goal: InvestmentGoal;
    timeHorizonYears: number;
}

export interface PortfolioMetrics {
    totalInvested: number;
    currentValue: number;
    profitLoss: number;
    profitLossPercent: number;
    holdings: Array<{
        symbol: string;
        invested: number;
        currentValue: number;
        profitLoss: number;
        profitLossPercent: number;
    }>;
}

export interface BudgetAllocation {
    stock: Stock;
    suggestedAmount: number;
    shares: number;
    reasoning: string;
}

// New Recommendation interface
export interface Recommendation {
    stock: Stock;
    action: 'buy' | 'sell' | 'hold';
    reasoning: string;
    projectedProfit?: number;
    confidence: 'low' | 'medium' | 'high';
    historicalData?: PricePoint[];
    details?: {
        analystRating?: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell' | string; // Made more flexible
        sectorTrend?: 'Bullish' | 'Bearish' | 'Neutral' | string; // Made more flexible
        volatility?: 'Low' | 'Medium' | 'High' | string; // Made more flexible
        userAlignment?: string;
    };
    modelPrediction?: PredictionResult | null; // Using PredictionResult
}

export interface AnalysisResult {
    portfolioMetrics?: PortfolioMetrics;
    recommendations: Recommendation[];
    budgetAllocations: BudgetAllocation[];
    summary: string;
}

/**
 * Calculate portfolio metrics from holdings
 */
export function calculatePortfolioMetrics(
    holdings: HoldingInput[],
    stocks: Stock[]
): PortfolioMetrics {
    let totalInvested = 0;
    let currentValue = 0;

    const holdingMetrics = holdings.map(holding => {
        const stock = stocks.find(s => s.symbol === holding.symbol);
        const invested = holding.quantity * holding.averagePrice;
        const current = stock ? holding.quantity * stock.price : invested;
        const pl = current - invested;
        const plPercent = (pl / invested) * 100;

        totalInvested += invested;
        currentValue += current;

        return {
            symbol: holding.symbol,
            invested,
            currentValue: current,
            profitLoss: pl,
            profitLossPercent: plPercent,
        };
    });

    return {
        totalInvested,
        currentValue,
        profitLoss: currentValue - totalInvested,
        profitLossPercent: ((currentValue - totalInvested) / totalInvested) * 100,
        holdings: holdingMetrics,
    };
}

/**
 * Suggest budget allocation across recommended stocks
 */
function allocateBudget(
    recommendedStocks: Stock[],
    budget: number,
    riskTolerance: RiskLevel
): BudgetAllocation[] {
    if (budget <= 0 || recommendedStocks.length === 0) return [];

    // Allocate based on risk tolerance
    const allocations: BudgetAllocation[] = [];
    let remainingBudget = budget;

    // For low risk: equal distribution
    // For medium: weighted by performance
    // For high: concentrated in top picks
    const weights = recommendedStocks.map((stock, idx) => {
        if (riskTolerance === 'low') return 1; // Equal
        if (riskTolerance === 'medium') return recommendedStocks.length - idx; // Decreasing
        return idx === 0 ? 3 : idx === 1 ? 2 : 1; // Top-heavy
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    recommendedStocks.forEach((stock, idx) => {
        const allocation = (budget * weights[idx]) / totalWeight;
        const shares = Math.floor(allocation / stock.price);
        const actualAmount = shares * stock.price;

        if (shares > 0 && actualAmount <= remainingBudget) {
            allocations.push({
                stock,
                suggestedAmount: actualAmount,
                shares,
                reasoning: `Allocate ${((allocation / budget) * 100).toFixed(1)}% of budget based on ${riskTolerance} risk strategy`,
            });
            remainingBudget -= actualAmount;
        }
    });

    return allocations;
}

/**
 * Generate simulated historical data for a stock
 */
function generateHistoricalData(currentPrice: number, trend: 'up' | 'down' | 'neutral' = 'up'): { day: string; price: number }[] {
    const data = [];
    const days = ['2020', '2021', '2022', '2023', '2024', '2025']; // Recent years trend
    let price = currentPrice * (trend === 'up' ? 0.6 : trend === 'down' ? 1.4 : 1.0); // Start lower/higher for longer timeframe

    for (const day of days) {
        // Add some random volatility
        const volatility = (Math.random() - 0.5) * 0.02; // +/- 1%
        const trendFactor = trend === 'up' ? 1.005 : trend === 'down' ? 0.995 : 1.0;

        price = price * (1 + volatility) * trendFactor;
        data.push({
            day,
            price: Number(price.toFixed(2))
        });
    }

    // Ensure the last point connects roughly to current price
    data[data.length - 1].price = currentPrice;

    return data;
}

/**
 * Main analyzer function
 */
export function analyzePortfolio(
    input: AnalyzerInput,
    allStocks: Stock[]
): AnalysisResult {
    // 1. Calculate portfolio metrics if holdings exist
    const portfolioMetrics = input.holdings.length > 0
        ? calculatePortfolioMetrics(input.holdings, allStocks)
        : undefined;

    // 2. Create temporary profile for recommendations
    const tempProfile = {
        name: 'Analyzer',
        age: 30,
        riskTolerance: input.riskTolerance,
        goals: [input.goal],
        timeHorizonYears: input.timeHorizonYears,
        initialInvestment: input.availableBudget,
        hasCompletedOnboarding: true,
        portfolio: input.holdings,
    };

    // 3. Get recommendations
    const recs = getRecommendations(allStocks, tempProfile, 8);

    // 4. Categorize recommendations
    // 4. Categorize generic buy recommendations
    const buyRecommendations: AnalysisResult['recommendations'] = recs.map(rec => ({
        stock: rec.stock,
        action: 'buy',
        reasoning: rec.reasoning,
        confidence: rec.confidence,
        historicalData: generateHistoricalData(rec.stock.price, 'up'),
        projectedProfit: Math.floor(Math.random() * 15) + 10,
        details: {
            sectorTrend: Math.random() > 0.3 ? 'Bullish' : 'Neutral',
            analystRating: Math.random() > 0.2 ? 'Strong Buy' : 'Buy',
            volatility: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
            userAlignment: `Matches your ${input.riskTolerance} risk profile and ${input.goal} goal.`,
        },
    }));

    // 5. Analyze existing holdings (Sell/Hold)
    const holdingRecommendations: AnalysisResult['recommendations'] = [];

    if (portfolioMetrics) {
        portfolioMetrics.holdings.forEach(holding => {
            const stock = allStocks.find(s => s.symbol === holding.symbol);
            if (!stock) return;

            // Sell if loss > 15% and low risk tolerance
            if (holding.profitLossPercent < -15 && input.riskTolerance === 'low') {
                holdingRecommendations.push({
                    stock,
                    action: 'sell',
                    reasoning: `Down ${Math.abs(holding.profitLossPercent).toFixed(1)}%, exceeds low risk tolerance threshold`,
                    confidence: 'high',
                    historicalData: generateHistoricalData(stock.price, 'down'),
                    projectedProfit: -5,
                    details: {
                        sectorTrend: 'Bearish',
                        analystRating: 'Hold',
                        volatility: 'High',
                        userAlignment: 'Does not align with your low risk tolerance due to high losses.',
                    },
                });
            }
            // Sell if profit > 25% (Profit Taking)
            else if (holding.profitLossPercent > 25) {
                holdingRecommendations.push({
                    stock,
                    action: 'sell',
                    reasoning: `Strong profit of ${holding.profitLossPercent.toFixed(1)}%. Consider taking profits.`,
                    confidence: 'medium',
                    historicalData: generateHistoricalData(stock.price, 'up'),
                    projectedProfit: 5,
                    details: {
                        sectorTrend: 'Neutral',
                        analystRating: 'Buy',
                        volatility: 'Medium',
                        userAlignment: 'Profit target reached. Consider reallocating.',
                    },
                });
            }
            // Otherwise HOLD
            else {
                holdingRecommendations.push({
                    stock,
                    action: 'hold',
                    reasoning: `Performance is stable (${holding.profitLossPercent >= 0 ? '+' : ''}${holding.profitLossPercent.toFixed(1)}%). Keep holding.`,
                    confidence: 'high',
                    historicalData: generateHistoricalData(stock.price, 'neutral'),
                    projectedProfit: 3,
                    details: {
                        sectorTrend: 'Neutral',
                        analystRating: 'Hold',
                        volatility: 'Low',
                        userAlignment: 'Aligns with your current strategy. No action needed.',
                    },
                });
            }
        });
    }

    // 6. Combine: Holdings FIRST, then Buys
    const recommendations = [...holdingRecommendations, ...buyRecommendations];

    // 6. Allocate budget
    const topBuyPicks = recommendations
        .filter(r => r.action === 'buy')
        .map(r => r.stock)
        .slice(0, 5); // Top 5 for allocation

    const budgetAllocations = allocateBudget(
        topBuyPicks,
        input.availableBudget,
        input.riskTolerance
    );

    // 7. Generate summary
    const summary = generateSummary(input, portfolioMetrics, recommendations, budgetAllocations);

    return {
        portfolioMetrics,
        recommendations,
        budgetAllocations,
        summary,
    };
}

function generateSummary(
    input: AnalyzerInput,
    metrics: PortfolioMetrics | undefined,
    recommendations: AnalysisResult['recommendations'],
    allocations: BudgetAllocation[]
): string {
    const parts: string[] = [];

    if (metrics) {
        parts.push(`Your portfolio is currently ${metrics.profitLoss >= 0 ? 'up' : 'down'} ${Math.abs(metrics.profitLossPercent).toFixed(1)}%.`);
    }

    parts.push(`Based on your ${input.riskTolerance} risk tolerance and ${input.goal} goal, we found ${recommendations.filter(r => r.action === 'buy').length} strong buy opportunities.`);

    if (allocations.length > 0) {
        parts.push(`With your ₹${input.availableBudget.toLocaleString()} budget, we suggest investing in ${allocations.length} stocks.`);
    }

    const sellCount = recommendations.filter(r => r.action === 'sell').length;
    if (sellCount > 0) {
        parts.push(`Consider selling ${sellCount} holdings to rebalance your portfolio.`);
    }

    return parts.join(' ');
}

/**
 * Enhance the analysis with AI insights
 */
export async function enrichWithAI(
    result: AnalysisResult,
    input: AnalyzerInput
): Promise<AnalysisResult> {
    // Only enrich if we have portfolio logic
    if (!result.portfolioMetrics) return result;

    const profileSummary = `${input.riskTolerance} risk tolerance, ${input.goal} goal, ${input.timeHorizonYears} year horizon.`;
    const metricsSummary = `Total Value: ₹${result.portfolioMetrics.currentValue.toFixed(0)}, Profit/Loss: ₹${result.portfolioMetrics.profitLoss.toFixed(0)} (${result.portfolioMetrics.profitLossPercent.toFixed(1)}%)`;
    const holdingsSummary = result.portfolioMetrics.holdings.map(h => `${h.symbol}: ${h.profitLossPercent.toFixed(1)}%`).join(', ');

    const aiSummary = await generatePortfolioInsight(profileSummary, metricsSummary, holdingsSummary);

    return {
        ...result,
        summary: aiSummary
    };
}

/**
 * Augment recommendations with Custom Model predictions
 */
export async function enrichWithModel(result: AnalysisResult): Promise<AnalysisResult> {
    const enrichedRecs = await Promise.all(result.recommendations.map(async (rec) => {
        // Generate mock history for model input (since we don't have full API history yet)
        // In production, fetch real history for 'rec.stock.symbol'
        const currentPrice = rec.stock.price;
        const mockPrices = Array.from({ length: 30 }, (_, i) => currentPrice * (1 + (Math.random() * 0.1 - 0.05)));
        const mockVolumes = Array.from({ length: 30 }, () => 100000 + Math.random() * 50000);

        // Ensure accuracy
        mockPrices[mockPrices.length - 1] = currentPrice;

        const prediction = await getCustomPrediction(mockPrices, mockVolumes, rec.stock.symbol);

        // Refine advice based on prediction
        let refinedReasoning = rec.reasoning;
        let refinedAction = rec.action;

        if (prediction && typeof prediction.prediction === 'number') {
            const predPercent = prediction.prediction * 100;

            // Logic Override: If we were going to sell (profit taking), but model is BULLISH (>2%), suggest HOLD
            if (refinedAction === 'sell' && predPercent > 2) {
                refinedAction = 'hold';
                refinedReasoning = `Model Override: Although you have strong profits, the AI Model is highly BULLISH (+${predPercent.toFixed(1)}%). We suggest HOLDING to capture further gains instead of profit-taking now.`;
            }
            // Logic Override: If we were going to hold, but model is BEARISH (<-3%), suggest SELL
            else if (refinedAction === 'hold' && predPercent < -3) {
                refinedAction = 'sell';
                refinedReasoning = `Model Warning: Current performance is stable, but the AI Model is strictly BEARISH (${predPercent.toFixed(1)}%). Consider selling now to protect your capital.`;
            }
            // Standard refinement if no override
            else {
                if (predPercent > 1) {
                    refinedReasoning += ` (AI Model is BULLISH: +${predPercent.toFixed(1)}%)`;
                } else if (predPercent < -1) {
                    refinedReasoning += ` (AI Model is BEARISH: ${predPercent.toFixed(1)}%)`;
                }
            }
        }

        return {
            ...rec,
            action: refinedAction,
            reasoning: refinedReasoning,
            modelPrediction: prediction
        };
    }));

    return {
        ...result,
        recommendations: enrichedRecs
    };
}
