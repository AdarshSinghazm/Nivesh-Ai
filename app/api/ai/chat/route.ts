import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI, extractStockSymbol } from '@/lib/services/aiChatService';

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Extract stock symbol if mentioned
        const stockSymbol = extractStockSymbol(message);

        // Get AI response
        const response = await chatWithAI(message, stockSymbol);

        return NextResponse.json({
            response,
            stockSymbol
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
