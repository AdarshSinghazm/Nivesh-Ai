export interface StockPrediction {
    symbol: string;
    predictions: DayPrediction[];
    trend: 'bullish' | 'bearish' | 'neutral';
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    accuracy: number;
    confidence: number;
}

export interface DayPrediction {
    day: number;
    date: string;
    price: number;
    lower: number;
    upper: number;
    confidence: number;
}

// Mock prediction data for demo
export const mockPredictions: Record<string, StockPrediction> = {
    RELIANCE: {
        symbol: 'RELIANCE',
        trend: 'bullish',
        recommendation: 'BUY',
        accuracy: 72,
        confidence: 78,
        predictions: [
            { day: 1, date: '2026-02-19', price: 2465, lower: 2450, upper: 2480, confidence: 78 },
            { day: 2, date: '2026-02-20', price: 2478, lower: 2460, upper: 2496, confidence: 75 },
            { day: 3, date: '2026-02-21', price: 2490, lower: 2468, upper: 2512, confidence: 72 },
            { day: 4, date: '2026-02-22', price: 2502, lower: 2476, upper: 2528, confidence: 70 },
            { day: 5, date: '2026-02-23', price: 2515, lower: 2485, upper: 2545, confidence: 68 },
            { day: 6, date: '2026-02-24', price: 2525, lower: 2490, upper: 2560, confidence: 66 },
            { day: 7, date: '2026-02-25', price: 2540, lower: 2500, upper: 2580, confidence: 65 }
        ]
    },
    TCS: {
        symbol: 'TCS',
        trend: 'bullish',
        recommendation: 'HOLD',
        accuracy: 68,
        confidence: 72,
        predictions: [
            { day: 1, date: '2026-02-19', price: 3462, lower: 3445, upper: 3479, confidence: 72 },
            { day: 2, date: '2026-02-20', price: 3475, lower: 3455, upper: 3495, confidence: 70 },
            { day: 3, date: '2026-02-21', price: 3488, lower: 3465, upper: 3511, confidence: 68 },
            { day: 4, date: '2026-02-22', price: 3500, lower: 3474, upper: 3526, confidence: 66 },
            { day: 5, date: '2026-02-23', price: 3512, lower: 3482, upper: 3542, confidence: 64 },
            { day: 6, date: '2026-02-24', price: 3525, lower: 3490, upper: 3560, confidence: 62 },
            { day: 7, date: '2026-02-25', price: 3538, lower: 3498, upper: 3578, confidence: 60 }
        ]
    },
    INFY: {
        symbol: 'INFY',
        trend: 'neutral',
        recommendation: 'HOLD',
        accuracy: 70,
        confidence: 65,
        predictions: [
            { day: 1, date: '2026-02-19', price: 1452, lower: 1440, upper: 1464, confidence: 65 },
            { day: 2, date: '2026-02-20', price: 1455, lower: 1440, upper: 1470, confidence: 63 },
            { day: 3, date: '2026-02-21', price: 1458, lower: 1440, upper: 1476, confidence: 61 },
            { day: 4, date: '2026-02-22', price: 1460, lower: 1438, upper: 1482, confidence: 59 },
            { day: 5, date: '2026-02-23', price: 1462, lower: 1436, upper: 1488, confidence: 57 },
            { day: 6, date: '2026-02-24', price: 1465, lower: 1434, upper: 1496, confidence: 55 },
            { day: 7, date: '2026-02-25', price: 1468, lower: 1432, upper: 1504, confidence: 53 }
        ]
    },
    HDFCBANK: {
        symbol: 'HDFCBANK',
        trend: 'bullish',
        recommendation: 'BUY',
        accuracy: 75,
        confidence: 80,
        predictions: [
            { day: 1, date: '2026-02-19', price: 1625, lower: 1615, upper: 1635, confidence: 80 },
            { day: 2, date: '2026-02-20', price: 1638, lower: 1625, upper: 1651, confidence: 78 },
            { day: 3, date: '2026-02-21', price: 1650, lower: 1634, upper: 1666, confidence: 76 },
            { day: 4, date: '2026-02-22', price: 1662, lower: 1642, upper: 1682, confidence: 74 },
            { day: 5, date: '2026-02-23', price: 1675, lower: 1650, upper: 1700, confidence: 72 },
            { day: 6, date: '2026-02-24', price: 1688, lower: 1658, upper: 1718, confidence: 70 },
            { day: 7, date: '2026-02-25', price: 1700, lower: 1665, upper: 1735, confidence: 68 }
        ]
    },
    TATAMOTORS: {
        symbol: 'TATAMOTORS',
        trend: 'bearish',
        recommendation: 'SELL',
        accuracy: 66,
        confidence: 62,
        predictions: [
            { day: 1, date: '2026-02-19', price: 768, lower: 760, upper: 776, confidence: 62 },
            { day: 2, date: '2026-02-20', price: 762, lower: 752, upper: 772, confidence: 60 },
            { day: 3, date: '2026-02-21', price: 756, lower: 744, upper: 768, confidence: 58 },
            { day: 4, date: '2026-02-22', price: 750, lower: 736, upper: 764, confidence: 56 },
            { day: 5, date: '2026-02-23', price: 744, lower: 728, upper: 760, confidence: 54 },
            { day: 6, date: '2026-02-24', price: 738, lower: 720, upper: 756, confidence: 52 },
            { day: 7, date: '2026-02-25', price: 732, lower: 712, upper: 752, confidence: 50 }
        ]
    }
};

export function getMockPrediction(symbol: string): StockPrediction | null {
    return mockPredictions[symbol] || null;
}
