import { NextRequest, NextResponse } from 'next/server';
import { getLiveStockPrice } from '@/lib/services/liveDataService';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol');

        if (!symbol) {
            return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }

        const data = await getLiveStockPrice(symbol);

        if (!data) {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Live price API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
