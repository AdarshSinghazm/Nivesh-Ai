'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ... imports

interface ChartDataPoint {
    day: string;
    price: number;
}

interface StockChartProps {
    data?: ChartDataPoint[];
}

const defaultData = [
    { day: 'Mon', price: 150 },
    { day: 'Tue', price: 152 },
    { day: 'Wed', price: 149 },
    { day: 'Thu', price: 153 },
    { day: 'Fri', price: 155 },
    { day: 'Sat', price: 158 },
    { day: 'Sun', price: 160 },
];

export default function StockChart({ data = defaultData }: StockChartProps) {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1a1a1a',
                            borderRadius: '12px',
                            border: '1px solid #2a2a2a',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#00ff9d' }}
                        labelStyle={{ color: '#9ca3af' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#00ff9d"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#00ff9d', stroke: '#000', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
