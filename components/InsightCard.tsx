import { Insight } from '@/lib/services/copilotService';
import { Lightbulb, Info } from 'lucide-react';

export default function InsightCard({ insight }: { insight: Insight }) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-indigo-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                        <Lightbulb size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {insight.action.toUpperCase()} <span className="text-indigo-600">{insight.stockSymbol}</span>
                        </h3>
                        {insight.timeHorizon && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                {insight.timeHorizon}
                            </span>
                        )}
                        <div className="flex items-center mt-1">
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500"
                                    style={{ width: `${insight.confidence}%` }}
                                />
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{insight.confidence.toFixed(0)}% Confidence</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-slate-50 p-4 rounded-md border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center mb-2">
                    <Info size={16} className="mr-2 text-indigo-500" />
                    Why this suggestion?
                </h4>
                <p className="text-sm text-slate-600 mb-3 italic">&quot;{insight.explanation}&quot;</p>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    {insight.reasoning.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
