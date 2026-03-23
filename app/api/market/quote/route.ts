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
            // Fetch single quote
            // @ts-expect-error - yahoo-finance returns a broader quote object than the default type allows
            const quote = await yahooFinance.quote(symbol);
            return NextResponse.json({ quote });
        }
    } catch (error) {
        console.error('Yahoo Finance API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Failed to fetch stock data', details: errorMessage }, { status: 500 });
    }
}
