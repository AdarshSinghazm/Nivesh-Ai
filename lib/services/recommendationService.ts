import { Stock } from './marketService';
import { UserProfile, RiskLevel, InvestmentGoal } from '../hooks/useUserProfile';

export interface StockRecommendation {
    stock: Stock;
    score: number;
    reasoning: string;
    confidence: 'high' | 'medium' | 'low';
}

// Sector preferences based on investment goals
const GOAL_SECTOR_PREFERENCES: Record<InvestmentGoal, string[]> = {
    retirement: ['Financial', 'Consumer Defensive'],
    income: ['Financial', 'Consumer Defensive', 'Energy'],
    growth: ['Technology', 'Communication'],
    speculation: ['Automotive', 'Resource', 'Technology'],
};

// Risk level mapping
const RISK_LEVELS: Record<RiskLevel, ('low' | 'medium' | 'high')[]> = {
    low: ['low'],
    medium: ['low', 'medium'],
    high: ['low', 'medium', 'high'],
};

/**
 * Filter stocks based on user's risk tolerance
 */
function filterByRisk(stocks: Stock[], riskTolerance: RiskLevel): Stock[] {
    const allowedRisks = RISK_LEVELS[riskTolerance];
    return stocks.filter(stock => allowedRisks.includes(stock.riskRating));
}

/**
 * Calculate score for a stock based on user profile
 */
function scoreStock(stock: Stock, profile: UserProfile): number {
    let score = 0;

    // Risk match (40 points)
    const allowedRisks = RISK_LEVELS[profile.riskTolerance];
    if (stock.riskRating === profile.riskTolerance) {
        score += 40; // Perfect match
    } else if (allowedRisks.includes(stock.riskRating)) {
        score += 25; // Acceptable match
    }

    // Sector match (30 points)
    const preferredSectors = profile.goals.flatMap(goal => GOAL_SECTOR_PREFERENCES[goal]);
    if (preferredSectors.includes(stock.sector)) {
        score += 30;
    }

    // Performance (30 points) - normalize to 0-30 range
    // Positive change is good, but cap at reasonable levels
    const performanceScore = Math.min(30, Math.max(0, (stock.changePercent + 2) * 10));
    score += performanceScore;

    return score;
}

/**
 * Generate reasoning for recommendation
 */
function generateReasoning(stock: Stock, profile: UserProfile): string {
    const reasons: string[] = [];

    // Risk reasoning
    if (stock.riskRating === profile.riskTolerance) {
        reasons.push(`Matches your ${profile.riskTolerance} risk tolerance perfectly`);
    } else {
        reasons.push(`Acceptable ${stock.riskRating} risk for your profile`);
    }

    // Sector reasoning
    const preferredSectors = profile.goals.flatMap(goal => GOAL_SECTOR_PREFERENCES[goal]);
    if (preferredSectors.includes(stock.sector)) {
        const matchingGoal = profile.goals.find(goal =>
            GOAL_SECTOR_PREFERENCES[goal].includes(stock.sector)
        );
        reasons.push(`${stock.sector} sector aligns with your ${matchingGoal} goal`);
    }

    // Performance reasoning
    if (stock.changePercent > 1) {
        reasons.push(`Strong recent performance (+${stock.changePercent.toFixed(2)}%)`);
    } else if (stock.changePercent > 0) {
        reasons.push(`Positive momentum (+${stock.changePercent.toFixed(2)}%)`);
    } else if (stock.changePercent < -1) {
        reasons.push(`Currently undervalued (${stock.changePercent.toFixed(2)}%)`);
    }

    return reasons.join('. ');
}

/**
 * Determine confidence level based on score
 */
function getConfidence(score: number): 'high' | 'medium' | 'low' {
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
}

/**
 * Get stock recommendations based on user profile
 */
export function getRecommendations(
    stocks: Stock[],
    profile: UserProfile,
    limit: number = 5
): StockRecommendation[] {
    // Filter by risk tolerance
    const filteredStocks = filterByRisk(stocks, profile.riskTolerance);

    // Score and sort
    const scoredStocks = filteredStocks.map(stock => ({
        stock,
        score: scoreStock(stock, profile),
        reasoning: generateReasoning(stock, profile),
        confidence: getConfidence(scoreStock(stock, profile)),
    }));

    // Sort by score (descending) and return top N
    return scoredStocks
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

/**
 * Get a single recommendation explanation
 */
export function explainRecommendation(stock: Stock, profile: UserProfile): string {
    const score = scoreStock(stock, profile);
    const confidence = getConfidence(score);
    const reasoning = generateReasoning(stock, profile);

    return `${stock.symbol} is a ${confidence} confidence recommendation. ${reasoning}`;
}
