import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const interval = (searchParams.get('interval') as any) || '1d';

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
    }

    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Fetch historical chart data
        const result = await yahooFinance.chart(symbol, {
            period1: oneMonthAgo,
            interval: interval
        });

        // Map to a simpler format for the UI
        const history = result.quotes.map((q: any) => ({
            date: q.date,
            close: q.close,
            volume: q.volume
        })).filter((q: any) => q.close !== null);

        return NextResponse.json({ symbol, history });
    } catch (error: any) {
        console.error('Yahoo Finance History Error:', error);
        return NextResponse.json({ error: 'Failed to fetch historical data', details: error.message }, { status: 500 });
    }
}
