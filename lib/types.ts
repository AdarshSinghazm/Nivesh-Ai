export interface TechnicalIndicators {
    rsi: number;
    macd: number;
    ma50: number;
    ma200: number;
    volume: number;
    weekHigh52: number;
    weekLow52: number;
    support: number;
    resistance: number;
    trend: 'bullish' | 'bearish' | 'neutral';
}

export interface FundamentalMetrics {
    peRatio: number;
    sectorPE: number;
    marketCap: number; // in crores
    revenueGrowth: number; // percentage
    earningsGrowth: number; // percentage
    debtToEquity: number;
    dividendYield: number; // percentage
    freeCashFlow: number; // in crores
    roe: number; // Return on Equity percentage
}

export interface MarketSentiment {
    fiiActivity: 'buying' | 'selling' | 'neutral';
    diiActivity: 'buying' | 'selling' | 'neutral';
    analystRating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    newsSentiment: 'positive' | 'negative' | 'neutral';
}

export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    sector: string;
    riskRating: 'low' | 'medium' | 'high';
    technical: TechnicalIndicators;
    fundamental: FundamentalMetrics;
    sentiment: MarketSentiment;
}

export interface EnhancedStock extends Stock {}

export interface PricePoint {
    day: string;
    price: number;
    fullDate?: string;
}

export interface StockQuote {
    regularMarketPrice?: number;
    regularMarketChange?: number;
    regularMarketChangePercent?: number;
    symbol?: string;
}
