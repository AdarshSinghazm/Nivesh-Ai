'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, BarChart2, Shield, TrendingUp, Zap, Star, Users, Play, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import HeroGraphic from "@/components/HeroGraphic";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-background min-h-screen transition-colors duration-300 overflow-hidden">

      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] opacity-30" />
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">

            {/* Text Content */}
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-medium text-foreground">AI-Powered Investment Engine v2.0</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
                Nivesh <span className="bg-gradient-to-r from-[#00ff9d] to-cyan-400 bg-clip-text text-transparent">AI</span>
                <br />
                <span className="text-2xl lg:text-4xl font-black text-[#00ff9d] block mt-4 drop-shadow-[0_0_20px_rgba(0,255,157,0.5)] uppercase tracking-widest">Where AI Meets Smart Investments</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Analyze stocks, optimize portfolios, and get personalized investment advice powered by advanced Artificial Intelligence. Stop guessing, start investing smarter.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link href="/analyzer" className="group relative px-8 py-4 bg-primary text-black font-black rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">START ANALYZING <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                </Link>
                <Link href="/market" className="px-8 py-4 bg-secondary border border-border text-foreground font-black rounded-2xl hover:bg-secondary/80 hover:border-primary/50 transition-all active:scale-95 flex items-center gap-2">
                  VIEW LIVE MARKETS <Zap size={18} className="text-[#00ff9d]" />
                </Link>
              </div>



              {/* Social Proof (Hero) */}
              <div className="mt-10 flex items-center justify-center gap-6 border-t border-border/50 pt-8">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative flex items-center gap-3 bg-secondary/80 backdrop-blur-sm border border-primary/50 px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <TrendingUp size={24} />
                    </div>
                    <div className="text-left pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">Verified Engine</span>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground">NSE CORE DATA</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-foreground font-medium">Backtested on Recent 6-Month NSE Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-24 bg-card/30 border-y border-border/50 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Intelligence First</h2>
            <p className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
              Supercharge your portfolio
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              We combine institutional-grade data with next-gen AI to give you the edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Predictive ML Engine',
                desc: 'Proprietary Random Forest model trained on 6 months of NSE history to provide Bullish/Bearish signals and price predictions.',
                icon: Zap,
                color: 'text-[#00ff9d]',
                bg: 'bg-[#00ff9d]/10'
              },
              {
                title: 'GenAI Assistant',
                desc: 'Gemini Pro-powered copilot that understands your budget and risk profile to generate personalized investment strategies.',
                icon: BarChart2,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
              },
              {
                title: 'Live Market Sync',
                desc: 'Real-time integration with Yahoo Finance for 40+ NSE stocks, providing instant volatility and technical volume metrics.',
                icon: TrendingUp,
                color: 'text-purple-500',
                bg: 'bg-purple-500/10'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,255,157,0.2)] group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Ecosystem Section */}
      <div className="py-16 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Operating on a High-Performance Technical Ecosystem</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-all duration-500">
          {['GEMINI PRO AI', 'YAHOO FINANCE', 'SCIKIT-LEARN ML', 'NEXT.JS 15', 'PRISMA ORM'].map((tech) => (
            <span key={tech} className="text-sm md:text-base font-black text-foreground border border-border px-4 py-2 rounded-lg bg-secondary/30">{tech}</span>
          ))}
        </div>
      </div>

      {/* Simple Footer Preview */}
      <footer className="border-t border-border bg-card/50 py-12 text-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 items-start text-left">
          <div className="space-y-4">
            <p className="text-3xl font-black text-foreground">Nivesh<span className="text-[#00ff9d]">AI</span></p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Where AI meets smart investments. The ultimate copilot for the modern Indian investor.</p>
            <p className="text-xs text-muted-foreground mt-2">© 2024 NiveshAI Inc.</p>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Subscription Plans</h3>
            <div className="space-y-4">
              <div className="bg-secondary/50 p-4 rounded-xl border border-border">
                <p className="text-xs font-black text-primary uppercase tracking-tighter">Free Trial</p>
                <p className="text-lg font-black text-foreground">3 Days Full Access</p>
                <p className="text-[10px] text-muted-foreground">Get started with zero risk</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                <p className="text-xs font-black text-[#00ff9d] uppercase tracking-tighter">Premium Plan</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black text-foreground">₹299</p>
                  <p className="text-xs text-muted-foreground">/Month</p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 mb-4">Unlimited AI Analysis & ML Predictions</p>
                <Link href="/analyzer" className="block w-full text-center bg-primary text-black text-xs font-black py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all">
                  BUY PREMIUM NOW
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium text-muted-foreground justify-center">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Links</h3>
            <Link href="#" className="hover:text-[#00ff9d] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#00ff9d] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#00ff9d] transition-colors">Contact Support</Link>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <p className="text-xs font-bold text-foreground">Stay Updated</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-[#00ff9d] outline-none" />
              <button className="bg-[#00ff9d] text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#00ff9d]/90">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
