import { Stock, PricePoint, StockQuote } from '../types';
import { getAllEnhancedStocks, getEnhancedStockData, getStockHistory as getHistoryFromEnhanced } from './enhancedStockService';

export type { Stock, PricePoint, StockQuote };

export async function getMarketOverview(): Promise<Stock[]> {
    return await getAllEnhancedStocks();
}

export async function getStockDetails(symbol: string): Promise<Stock | undefined> {
    const stock = await getEnhancedStockData(symbol);
    return stock || undefined;
}

export async function getStockHistory(symbol: string, interval: string = '1d'): Promise<PricePoint[]> {
    return await getHistoryFromEnhanced(symbol, interval);
}
