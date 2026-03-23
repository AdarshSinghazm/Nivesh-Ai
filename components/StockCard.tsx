import { Stock } from '@/lib/services/marketService';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StockCard({ stock }: { stock: Stock }) {
    const isPositive = stock.change >= 0;

    return (
        <div className="bg-card p-6 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{stock.symbol}</h3>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${isPositive ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                    }`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="font-bold text-sm">{Math.abs(stock.changePercent).toFixed(2)}%</span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-foreground">₹{stock.price.toFixed(2)}</span>
                </div>
                <div className={`text-sm font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                    {isPositive ? '+' : ''}₹{stock.change.toFixed(2)}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs">
                <span className="text-muted-foreground uppercase font-bold tracking-wider">Risk Level</span>
                <span className={`px-2 py-1 rounded font-bold uppercase ${stock.riskRating === 'low' ? 'bg-green-500/20 text-green-400' :
                    stock.riskRating === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                    }`}>
                    {stock.riskRating}
                </span>
            </div>
        </div>
    );
}
