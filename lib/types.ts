export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    sector: string;
    riskRating: 'low' | 'medium' | 'high';
    technical?: {
        volume?: number;
        marketCap?: string;
        peRatio?: number;
    };
}

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
