'use client';

import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ChartDataPoint {
    day: string;
    price: number;
    upper?: number;
    lower?: number;
    isForecast?: boolean;
}

interface StockChartProps {
    data?: ChartDataPoint[];
}

export default function StockChart({ data = [] }: StockChartProps) {
    if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        domain={['auto', 'auto']}
                        hide={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderRadius: '12px',
                            border: '1px solid #334155',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                            fontSize: '12px'
                        }}
                        itemStyle={{ padding: '2px 0' }}
                    />
                    
                    {/* Upper/Lower Range (Fan Chart) */}
                    <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="none"
                        fill="#3b82f6"
                        fillOpacity={0.1}
                        connectNulls
                    />
                    <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="none"
                        fill="#0f172a" 
                        fillOpacity={1}
                        connectNulls
                    />

                    {/* Historical Price */}
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#00ff9d"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 4, fill: '#00ff9d' }}
                        connectNulls
                    />

                    {/* Forecast Line (distinguished by color and potentially dashed) */}
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        connectNulls
                        name="Forecast"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
