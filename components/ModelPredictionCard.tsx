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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-5 text-white shadow-xl border border-slate-700">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Activity className="text-indigo-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-300">Nifty 50 ML Model</h3>
                        <p className="text-xs text-slate-500">Random Forest v1.0</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isPositive ? 'BULLISH' : 'BEARISH'}
                </div>
            </div>

            <div className="flex items-baseline space-x-1 mb-1">
                <span className="text-2xl font-bold">₹{projectedPrice.toFixed(2)}</span>
                <span className="text-sm text-slate-400">Target</span>
            </div>

            <div className={`flex items-center text-sm mb-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                <span className="font-medium">{Math.abs(percentageChange).toFixed(2)}%</span>
                <span className="text-slate-500 ml-2">predicted move</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/50">
                <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Volatility</p>
                    <p className="text-sm font-medium text-slate-200">{(prediction.features.Volatility * 100).toFixed(2)}%</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">MA (20 Day)</p>
                    <p className="text-sm font-medium text-slate-200">₹{prediction.features.MA20.toFixed(0)}</p>
                </div>
            </div>
        </div>
    );
}
