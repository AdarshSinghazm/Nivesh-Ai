import { UserProfile } from '@/lib/hooks/useUserProfile';
import { getMarketOverview } from './marketService';
import { getRecommendations, explainRecommendation } from './recommendationService';

export interface Insight {
    id: string;
    stockSymbol: string;
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
    reasoning: string[];
    explanation: string;
    timeHorizon?: string; // e.g., "Short-term (3-6 months)"
}

export async function generateInsights(profile: UserProfile): Promise<Insight[]> {
    const stocks = await getMarketOverview();
    const insights: Insight[] = [];
    const startId = Date.now();

    // 1. Analyze Existing Portfolio (Hold/Sell)
    if (profile.portfolio && profile.portfolio.length > 0) {
        for (const item of profile.portfolio) {
            const stock = stocks.find(s => s.symbol === item.symbol);
            if (!stock) continue;

            const currentReturn = ((stock.price - item.averagePrice) / item.averagePrice) * 100;
            const reasons: string[] = [];
            let score = 0; // Negative = Sell, Positive = Hold/Buy

            // Logic: Profit taking or Stop loss
            if (currentReturn > 20) {
                score -= 2; // Lean towards selling
                reasons.push(`You have a strong profit of ${currentReturn.toFixed(1)}%. Consider taking some profits.`);
            } else if (currentReturn < -15) {
                if (profile.riskTolerance === 'low') {
                    score -= 3;
                    reasons.push(`Stock is down ${Math.abs(currentReturn).toFixed(1)}%, exceeding your low risk tolerance.`);
                } else {
                    score += 1;
                    reasons.push(`Stock is down ${Math.abs(currentReturn).toFixed(1)}%, but fits your high risk tolerance for recovery.`);
                }
            }

            // Logic: Sector rotation based on goals
            if (profile.goals.includes('income') && stock.sector !== 'Financial' && stock.sector !== 'Consumer Defensive') {
                score -= 1;
                reasons.push(`Sector ${stock.sector} doesn't align well with your Income goal.`);
            }

            const action = score < -2 ? 'sell' : 'hold';
            const timeHorizon = action === 'sell' ? 'Immediate' : 'Long-term (1-3 years)';

            insights.push({
                id: `port-${item.symbol}-${startId}`,
                stockSymbol: item.symbol,
                action,
                confidence: 80 + Math.abs(score) * 5,
                reasoning: reasons,
                explanation: action === 'sell'
                    ? `We recommend selling ${item.symbol} to rebalance. ${reasons.join(' ')}`
                    : `Keep holding ${item.symbol}. ${reasons.join(' ')}`,
                timeHorizon
            });
        }
    }

    // 2. Scout New Opportunities (Buy) - Using Recommendation Service
    const recommendations = getRecommendations(stocks, profile, 5);

    for (const rec of recommendations) {
        // Skip if already owned
        if (profile.portfolio?.some(p => p.symbol === rec.stock.symbol)) continue;

        insights.push({
            id: `new-${rec.stock.symbol}-${startId}`,
            stockSymbol: rec.stock.symbol,
            action: 'buy',
            confidence: rec.score,
            reasoning: [rec.reasoning],
            explanation: `Proposed Addition: ${rec.stock.name}. ${rec.reasoning}`,
            timeHorizon: profile.timeHorizonYears > 5 ? 'Long-term (5+ years)' : 'Medium-term (1-3 years)'
        });
    }

    return insights;
}

export interface PredictionResult {
    prediction: number;
    features: {
        MA20: number;
        Return: number;
        Volatility: number;
        Volume: number;
    };
    last_price: number;
    historical_data?: {
        prices: number[];
        volumes: number[];
    };
}

export async function getCustomPrediction(
    prices: number[],
    volumes: number[],
    symbol?: string
): Promise<PredictionResult | null> {
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prices, volumes, symbol })
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Failed to get custom prediction:', error);
        return null;
    }
}
