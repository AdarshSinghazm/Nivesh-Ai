import { StockPrediction } from '@/lib/data/mockPredictions';
import { TrendingUp, TrendingDown, Minus, Target, Award } from 'lucide-react';

interface PricePredictionProps {
    prediction: StockPrediction;
}

export default function PricePrediction({ prediction }: PricePredictionProps) {
    const getTrendIcon = () => {
        if (prediction.trend === 'bullish') return <TrendingUp className="w-5 h-5 text-green-600" />;
        if (prediction.trend === 'bearish') return <TrendingDown className="w-5 h-5 text-red-600" />;
        return <Minus className="w-5 h-5 text-gray-600" />;
    };

    const getRecommendationColor = () => {
        if (prediction.recommendation === 'BUY') return 'bg-green-100 text-green-800 border-green-300';
        if (prediction.recommendation === 'SELL') return 'bg-red-100 text-red-800 border-red-300';
        return 'bg-blue-100 text-blue-800 border-blue-300';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Target className="w-6 h-6 text-indigo-600" />
                        ML Price Forecast (7 Days)
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Powered by Prophet AI Model</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-bold ${getRecommendationColor()}`}>
                    {prediction.recommendation}
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                        {getTrendIcon()}
                        <span className="text-sm font-medium text-gray-600">Trend</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 capitalize">{prediction.trend}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-600">Accuracy</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{prediction.accuracy}%</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">Confidence</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{prediction.confidence}%</p>
                </div>
            </div>

            {/* Predictions Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Day</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Predicted Price</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Range</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prediction.predictions.map((pred) => (
                            <tr key={pred.day} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">Day {pred.day}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">{pred.date}</td>
                                <td className="py-3 px-4 text-sm font-bold text-right text-gray-900">
                                    ₹{pred.price.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-gray-600">
                                    ₹{pred.lower} - ₹{pred.upper}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${pred.confidence >= 70 ? 'bg-green-100 text-green-800' :
                                            pred.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {pred.confidence}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Visual Chart */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Price Trend</span>
                    <span className="text-xs text-gray-600">Next 7 Days</span>
                </div>
                <div className="flex items-end justify-between h-32 gap-2">
                    {prediction.predictions.map((pred, idx) => {
                        const maxPrice = Math.max(...prediction.predictions.map(p => p.price));
                        const minPrice = Math.min(...prediction.predictions.map(p => p.price));
                        const range = maxPrice - minPrice;
                        const height = range > 0 ? ((pred.price - minPrice) / range) * 100 : 50;

                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t transition-all hover:opacity-80"
                                    style={{ height: `${height}%` }}
                                    title={`Day ${pred.day}: ₹${pred.price}`}
                                ></div>
                                <span className="text-xs text-gray-600">D{pred.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                    <strong>Disclaimer:</strong> ML predictions are for informational purposes only.
                    Past performance doesn&apos;t guarantee future results. Always do your own research.
                </p>
            </div>
        </div>
    );
}
