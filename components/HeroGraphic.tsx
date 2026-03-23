'use client';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Activity, PieChart } from 'lucide-react';

export default function HeroGraphic() {
    return (
        <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-50 animate-pulse" />

            {/* Main Glass Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 w-[320px] sm:w-[380px]"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Total Portfolio</p>
                        <h3 className="text-3xl font-black text-foreground">₹12,45,230</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <TrendingUp className="text-primary w-6 h-6" />
                    </div>
                </div>

                {/* Simulated Chart */}
                <div className="h-32 mb-6 flex items-end justify-between gap-2 px-1">
                    {[35, 45, 30, 60, 55, 75, 80].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-sm"
                        />
                    ))}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border border-border p-3 rounded-xl shadow-lg">
                        <p className="text-xs text-muted-foreground mb-1">Daily Profit</p>
                        <p className="text-foreground font-bold flex items-center gap-1">
                            <span className="text-primary">+₹12,400</span>
                        </p>
                    </div>
                    <div className="bg-card border border-border p-3 rounded-xl shadow-lg">
                        <p className="text-xs text-muted-foreground mb-1">Growth</p>
                        <p className="text-foreground font-bold text-primary">+12.5%</p>
                    </div>
                </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-4 z-20 bg-card border border-border p-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500">
                    <PieChart size={20} />
                </div>
                <div>
                    <p className="text-xs font-bold text-foreground">AI Optimized</p>
                    <p className="text-[10px] text-muted-foreground">Portfolio Rebalanced</p>
                </div>
            </motion.div>

            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-4 z-20 bg-card border border-border p-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
                <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                    <Activity size={20} />
                </div>
                <div>
                    <p className="text-xs font-bold text-foreground">Market Alert</p>
                    <p className="text-[10px] text-muted-foreground">Nifty 50 +1.2%</p>
                </div>
            </motion.div>
        </div>
    );
}
