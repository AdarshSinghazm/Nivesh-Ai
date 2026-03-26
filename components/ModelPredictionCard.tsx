import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface PredictionProps {
    prediction: {
        prediction: number;
        features: {
            MA20: number;
            Return: number;
            Volatility: number;
            Volume: number;
        };
        last_price: number;
    } | null;
}

export function ModelPredictionCard({ prediction }: PredictionProps) {
    if (!prediction) return null;

    // FIX: The model predicts RETURN (e.g., 0.02 for 2%), not PRICE.
    const predictedReturn = prediction.prediction; // e.g., 0.0303
    const currentPrice = prediction.last_price;

    // Calculate Target Price: Current * (1 + Return)
    const projectedPrice = currentPrice * (1 + predictedReturn);

    // Percentage is just return * 100
    const percentageChange = predictedReturn * 100;
    const isPositive = percentageChange > 0;

    return (
        <div className="bg-card rounded-2xl p-6 text-foreground shadow-xl border border-border">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Activity className="text-primary" size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Nifty 50 ML Model</h3>
                        <p className="text-xs text-muted-foreground/60">Random Forest v1.0</p>
                    </div>
                </div>
                <div className={`px-4 py-1 rounded-lg text-xs font-black tracking-widest ${isPositive ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                    {isPositive ? 'BULLISH' : 'BEARISH'}
                </div>
            </div>

            <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-black">₹{projectedPrice.toFixed(2)}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Target</span>
            </div>

            <div className={`flex items-center text-sm mb-6 ${isPositive ? 'text-primary' : 'text-red-500'}`}>
                {isPositive ? <ArrowUpRight size={18} className="mr-1" /> : <ArrowDownRight size={18} className="mr-1" />}
                <span className="font-black text-lg">{Math.abs(percentageChange).toFixed(2)}%</span>
                <span className="text-muted-foreground text-xs font-medium ml-2 uppercase tracking-widest">predicted move</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Volatility</p>
                    <p className="text-sm font-bold text-foreground">{(prediction.features.Volatility * 100).toFixed(2)}%</p>
                </div>
                <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">MA (20 Day)</p>
                    <p className="text-sm font-bold text-foreground">₹{prediction.features.MA20.toFixed(0)}</p>
                </div>
            </div>
        </div>
    );
}
