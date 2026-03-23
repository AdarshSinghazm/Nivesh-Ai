// NSE symbol mapping
const NSE_SUFFIX = '.NS';

export interface LiveStockData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
}

// Cache to avoid hitting rate limits
const cache = new Map<string, { data: LiveStockData; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 seconds

export async function getLiveStockPrice(symbol: string): Promise<LiveStockData | null> {
    try {
        // Check cache first
        const cached = cache.get(symbol);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        // Dynamic import for Yahoo Finance (server-side only)
        const yahooFinance = (await import('yahoo-finance2')).default;

        // Fetch from Yahoo Finance
        const nseSymbol = `${symbol}${NSE_SUFFIX}`;
        const quote: any = await yahooFinance.quote(nseSymbol);

        if (!quote) return null;

        const liveData: LiveStockData = {
            symbol,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            volume: quote.regularMarketVolume || 0,
            marketCap: (quote.marketCap || 0) / 10000000, // Convert to Cr
            high: quote.regularMarketDayHigh || 0,
            low: quote.regularMarketDayLow || 0,
            open: quote.regularMarketOpen || 0,
            previousClose: quote.regularMarketPreviousClose || 0
        };

        // Update cache
        cache.set(symbol, { data: liveData, timestamp: Date.now() });

        return liveData;
    } catch (error) {
        console.error(`Error fetching live data for ${symbol}:`, error);
        return null;
    }
}

export async function getMultipleLiveStocks(symbols: string[]): Promise<Record<string, LiveStockData | null>> {
    const results: Record<string, LiveStockData | null> = {};

    // Fetch in parallel
    await Promise.all(
        symbols.map(async (symbol) => {
            results[symbol] = await getLiveStockPrice(symbol);
        })
    );

    return results;
}

export async function getHistoricalData(symbol: string, days: number = 30) {
    try {
        // Dynamic import for Yahoo Finance (server-side only)
        const yahooFinance = (await import('yahoo-finance2')).default;

        const nseSymbol = `${symbol}${NSE_SUFFIX}`;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const history: any = await yahooFinance.historical(nseSymbol, {
            period1: startDate.toISOString().split('T')[0],
            period2: endDate.toISOString().split('T')[0],
            interval: '1d'
        });

        return history.map((h: any) => ({
            date: h.date,
            open: h.open,
            high: h.high,
            low: h.low,
            close: h.close,
            volume: h.volume
        }));
    } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error);
        return [];
    }
}
