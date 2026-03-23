import { NextResponse } from 'next/server';
import { getMarketOverview, getStockDetails } from '@/lib/services/marketService';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const symbol = searchParams.get('symbol');

        if (symbol) {
            // Get specific stock details
            const stock = await getStockDetails(symbol);
            if (!stock) {
                return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
            }
            return NextResponse.json({ stock });
        } else {
            // Get market overview
            const stocks = await getMarketOverview();
            return NextResponse.json({ stocks });
        }
    } catch (error: any) {
        console.error('Market API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch market data',
            details: error.message
        }, { status: 500 });
    }
}
