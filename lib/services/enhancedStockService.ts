import { Stock } from '../types';

export interface TechnicalIndicators {
    rsi: number; // 0-100
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

export interface EnhancedStock extends Stock {
    technical: TechnicalIndicators;
    fundamental: FundamentalMetrics;
    sentiment: MarketSentiment;
}

// Fallback data in case API fails
const fallbackStocks: Record<string, Partial<EnhancedStock>> = {
    'RELIANCE': {
        riskRating: 'medium',
        sector: 'Energy',
        sentiment: { fiiActivity: 'buying', diiActivity: 'neutral', analystRating: 'buy', newsSentiment: 'positive' }
    },
    'TCS': {
        riskRating: 'low',
        sector: 'Technology',
        sentiment: { fiiActivity: 'selling', diiActivity: 'buying', analystRating: 'hold', newsSentiment: 'neutral' }
    },
    'INFY': {
        riskRating: 'low',
        sector: 'Technology',
        sentiment: { fiiActivity: 'buying', diiActivity: 'buying', analystRating: 'buy', newsSentiment: 'positive' }
    },
    'HDFCBANK': {
        riskRating: 'low',
        sector: 'Financial',
        sentiment: { fiiActivity: 'buying', diiActivity: 'buying', analystRating: 'strong_buy', newsSentiment: 'positive' }
    }
};

async function fetchQuote(symbol: string) {
    try {
        const symbolToFetch = symbol === '^NSEI' ? symbol : `${symbol}.NS`;
        const response = await fetch(`/api/market/quote?symbol=${encodeURIComponent(symbolToFetch)}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.quote;
    } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}`, error);
        return null;
    }
}

async function fetchBatchQuotes(symbols: string[]) {
    try {
        const symbolParam = symbols.map(s => encodeURIComponent(`${s}.NS`)).join(',');
        const response = await fetch(`/api/market/quote?symbols=${symbolParam}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.quotes;
    } catch (error) {
        console.error(`Failed to fetch batch quotes`, error);
        return null;
    }
}

// Cache to prevent excessive API calls
const stockCache: Record<string, { data: EnhancedStock, timestamp: number }> = {};
const CACHE_DURATION = 60 * 1000; // 1 minute

function mapQuoteToEnhanced(symbol: string, quote: any): EnhancedStock {
    // Default/Fallback values
    const fallback = fallbackStocks[symbol] || {
        riskRating: 'medium',
        sector: 'Unknown',
        sentiment: { fiiActivity: 'neutral', diiActivity: 'neutral', analystRating: 'hold', newsSentiment: 'neutral' }
    };

    if (!quote) {
        return {
            symbol: symbol,
            name: symbol,
            price: 0.00,
            change: 0.00,
            changePercent: 0.00,
            sector: fallback.sector || 'Unknown',
            riskRating: fallback.riskRating || 'medium',
            technical: {
                rsi: 50, macd: 0, ma50: 0, ma200: 0, volume: 0,
                weekHigh52: 0, weekLow52: 0, support: 0, resistance: 0, trend: 'neutral'
            },
            fundamental: {
                peRatio: 0, sectorPE: 0, marketCap: 0, revenueGrowth: 0, earningsGrowth: 0,
                debtToEquity: 0, dividendYield: 0, freeCashFlow: 0, roe: 0
            },
            sentiment: fallback.sentiment as MarketSentiment
        } as EnhancedStock;
    }

    return {
        symbol: symbol,
        name: quote.longName || symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        sector: fallback.sector || 'Unknown',
        riskRating: fallback.riskRating || 'medium', // Yahoo doesn't provide risk rating easily

        technical: {
            rsi: 50, // Requires historical data calculation, using default
            macd: 0,
            ma50: quote.fiftyDayAverage || 0,
            ma200: quote.twoHundredDayAverage || 0,
            volume: quote.regularMarketVolume || 0,
            weekHigh52: quote.fiftyTwoWeekHigh || 0,
            weekLow52: quote.fiftyTwoWeekLow || 0,
            support: (quote.regularMarketPrice || 0) * 0.95, // Simple estimate
            resistance: (quote.regularMarketPrice || 0) * 1.05, // Simple estimate
            trend: (quote.regularMarketPrice > quote.twoHundredDayAverage) ? 'bullish' : 'bearish'
        },

        fundamental: {
            peRatio: quote.trailingPE || 0,
            sectorPE: (quote.trailingPE || 20) * 1.1, // Estimate
            marketCap: (quote.marketCap || 0) / 10000000, // Convert to Crores approx
            revenueGrowth: 10, // Not available in basic quote
            earningsGrowth: 10,
            debtToEquity: 0.5,
            dividendYield: quote.dividendYield || 0,
            freeCashFlow: 0,
            roe: 15
        },

        sentiment: fallback.sentiment as MarketSentiment
    };
}

export async function getEnhancedStockData(symbol: string): Promise<EnhancedStock | null> {
    const now = Date.now();
    if (stockCache[symbol] && (now - stockCache[symbol].timestamp < CACHE_DURATION)) {
        return stockCache[symbol].data;
    }

    const quote = await fetchQuote(symbol);
    const enhanced = mapQuoteToEnhanced(symbol, quote);

    // Only cache if we got valid data (price > 0), otherwise transient error shouldn't be cached long
    if (enhanced.price > 0) {
        stockCache[symbol] = { data: enhanced, timestamp: now };
    }
    return enhanced;
}

export async function getAllEnhancedStocks(): Promise<EnhancedStock[]> {
    const symbols = [
        'ADANIENT', 'ADANIPORTS', 'APOLLOHOSP', 'ASIANPAINT', 'AXISBANK',
        'BAJAJ-AUTO', 'BAJFINANCE', 'BHARTIARTL', 'BPCL', 'BRITANNIA',
        'CIPLA', 'COALINDIA', 'DRREDDY', 'EICHERMOT', 'GRASIM',
        'HCLTECH', 'HDFCBANK', 'HINDALCO', 'HINDUNILVR', 'ICICIBANK',
        'INDUSINDBK', 'INFY', 'ITC', 'JSWSTEEL', 'KOTAKBANK',
        'LT', 'M&M', 'MARUTI', 'NESTLEIND', 'NTPC',
        'ONGC', 'POWERGRID', 'RELIANCE', 'SBIN', 'SUNPHARMA',
        'TCS', 'TECHM', 'TITAN', 'ULTRACEMCO', 'WIPRO'
    ];
    const now = Date.now();

    // Check cache for all
    const uncachedSymbols = symbols.filter(s => !stockCache[s] || (now - stockCache[s].timestamp >= CACHE_DURATION));

    if (uncachedSymbols.length > 0) {
        // Chunk symbols to avoid API cutoff (Yahoo/Library limit around 20-30 quotes)
        const chunkSize = 15;
        const chunks = [];
        for (let i = 0; i < uncachedSymbols.length; i += chunkSize) {
            chunks.push(uncachedSymbols.slice(i, i + chunkSize));
        }

        // Fetch each chunk
        await Promise.all(chunks.map(async (chunk) => {
            const quotes = await fetchBatchQuotes(chunk);
            if (quotes && Array.isArray(quotes)) {
                for (const quote of quotes) {
                    if (!quote || !quote.symbol) continue;
                    const symbol = quote.symbol.replace('.NS', '');
                    if (symbols.includes(symbol)) {
                        const enhanced = mapQuoteToEnhanced(symbol, quote);
                        stockCache[symbol] = { data: enhanced, timestamp: now };
                    }
                }
            }
        }));
    }

    // Return all from cache (or re-process fallbacks if batch failed)
    return symbols.map(s => {
        if (stockCache[s]) return stockCache[s].data;
        return mapQuoteToEnhanced(s, null); // Fallback
    });
}

export async function getStockHistory(symbol: string, interval: string = '1d') {
    try {
        const symbolToFetch = symbol === '^NSEI' ? symbol : symbol; // history route handles symbols as passed or adds .NS if needed serverside
        const response = await fetch(`/api/market/history?symbol=${encodeURIComponent(symbolToFetch)}&interval=${interval}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.history;
    } catch (error) {
        console.error(`Failed to fetch history for ${symbol}`, error);
        return null;
    }
}

export async function getIndexQuote(symbol: string) {
    try {
        const response = await fetch(`/api/market/quote?symbol=${encodeURIComponent(symbol)}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`Index Quote API Error for ${symbol}:`, errorData);
            return null;
        }
        const data = await response.json();
        return data.quote;
    } catch (error) {
        console.error(`Network or Parsing failure for ${symbol}`, error);
        return null;
    }
}
