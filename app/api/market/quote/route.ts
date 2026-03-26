import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const symbolsParam = searchParams.get('symbols');

    if (!symbol && !symbolsParam) {
        return NextResponse.json({ error: 'Symbol or symbols query parameter is required' }, { status: 400 });
    }

    try {
        if (symbolsParam) {
            const symbols = symbolsParam.split(',');
            // Fetch multiple quotes
            const quotes = await yahooFinance.quote(symbols);
            return NextResponse.json({ quotes });
        } else {
            // Fetch single quote with extended data for real-world audit
            const quote = await yahooFinance.quote(symbol as string);
            
            let extendedData = {};
            try {
                // Fetch fundamentals (financials, stats)
                extendedData = await yahooFinance.quoteSummary(symbol as string, {
                    modules: ['financialData', 'defaultKeyStatistics', 'summaryDetail']
                });
            } catch (summaryError) {
                console.warn(`Could not fetch quoteSummary for ${symbol}`, summaryError);
            }

            return NextResponse.json({ 
                quote,
                fundamentals: extendedData 
            });
        }
    } catch (error) {
        console.error('Yahoo Finance API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Failed to fetch stock data', details: errorMessage }, { status: 500 });
    }
}
