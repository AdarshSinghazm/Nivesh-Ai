'use client';

import { Play, ExternalLink, TrendingUp, Clock, FileText, Filter, Bookmark, Share2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        "All", "Earnings", "IPO", "RBI", "Global Markets", "Tech", "Banking", "Commodities"
    ];

    const news = [
        // --- Market Movers / Global Markets ---
        {
            title: "Nifty holds above 25,700, Sensex up 200 points; PSU Banks rise",
            source: "NDTV Profit",
            time: "Live Updates",
            readTime: "3 min read",
            credibility: "High",
            tag: "Global Markets",
            image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.ndtvprofit.com/markets",
            category: "Global Markets"
        },
        // --- Earnings ---
        {
            title: "Ola Electric shares hit record low on weak Q3 results",
            source: "Financial Express",
            time: "1 hour ago",
            readTime: "4 min read",
            credibility: "High",
            tag: "Earnings",
            image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.financialexpress.com/market/",
            category: "Earnings"
        },
        // --- Tech ---
        {
            title: "Infosys surges 4% after partnership with Anthropic",
            source: "Economic Times",
            time: "3 hours ago",
            readTime: "5 min read",
            credibility: "Verified",
            tag: "Tech",
            image: "https://images.unsplash.com/photo-1535359056830-d4badde79747?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://economictimes.indiatimes.com/markets",
            category: "Tech"
        },
        {
            title: "Sarvam AI teases new smartglasses at India AI Summit",
            source: "India Today",
            time: "5 hours ago",
            readTime: "2 min read",
            credibility: "Verified",
            tag: "Tech",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.indiatoday.in/technology",
            category: "Tech"
        },
        {
            title: "Adani Group plans $100B investment in AI Data Centers",
            source: "The Hindu",
            time: "6 hours ago",
            readTime: "6 min read",
            credibility: "High",
            tag: "Tech",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.thehindu.com/sci-tech/technology/",
            category: "Tech"
        },
        // --- IPO ---
        {
            title: "Gaudium IVF IPO set to launch on Feb 20; GMP signals strong demand",
            source: "IPO Central",
            time: "2 hours ago",
            readTime: "3 min read",
            credibility: "Trusted",
            tag: "IPO",
            image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://ipocentral.in/",
            category: "IPO"
        },
        {
            title: "Razorpay shortlists investment banks for $1B IPO",
            source: "LiveMint",
            time: "4 hours ago",
            readTime: "4 min read",
            credibility: "High",
            tag: "IPO",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.livemint.com/market/ipo",
            category: "IPO"
        },
        // --- RBI ---
        {
            title: "RBI approves Bain Capital's stake in Manappuram Finance",
            source: "Business Standard",
            time: "3 hours ago",
            readTime: "2 min read",
            credibility: "Official",
            tag: "RBI",
            image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.business-standard.com/finance/news",
            category: "RBI"
        },
        {
            title: "RBI releases new draft directions on Foreign Exchange Dealings",
            source: "The Hindu",
            time: "1 day ago",
            readTime: "5 min read",
            credibility: "Official",
            tag: "RBI",
            image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.rbi.org.in/",
            category: "RBI"
        },
        // --- Banking ---
        {
            title: "Bank credit growth accelerates to 14.6% in Jan: RBI Data",
            source: "Business Standard",
            time: "12 hours ago",
            readTime: "3 min read",
            credibility: "Data",
            tag: "Banking",
            image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.business-standard.com/industry/banking",
            category: "Banking"
        },
        {
            title: "Government to form committee for Global Mega-Banks reform",
            source: "Financial Express",
            time: "14 hours ago",
            readTime: "4 min read",
            credibility: "High",
            tag: "Banking",
            image: "https://images.unsplash.com/photo-1535359056830-d4badde79747?auto=format&fit=crop&q=80&w=300&h=200", // Replaced broken image with Coins/Money
            url: "https://www.financialexpress.com/industry/banking-finance/",
            category: "Banking"
        },
        // --- Commodities ---
        {
            title: "Gold prices hit record high amid weak global cues",
            source: "Business Today",
            time: "5 hours ago",
            readTime: "3 min read",
            credibility: "Verified",
            tag: "Commodities",
            image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.businesstoday.in/commodities",
            category: "Commodities"
        },
        {
            title: "Hindalco Shares Correct 13% From Peak; InCred Downgrades",
            source: "NDTV Business",
            time: "4 hours ago",
            readTime: "4 min read",
            credibility: "High",
            tag: "Commodities",
            image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.ndtv.com/business",
            category: "Commodities"
        },
        {
            title: "Crude Oil surges as fuel price cut hopes fade",
            source: "Economic Times",
            time: "8 hours ago",
            readTime: "2 min read",
            credibility: "Verified",
            tag: "Commodities",
            image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=300&h=200", // Replaced broken image with Gold/Commodity
            url: "https://economictimes.indiatimes.com/markets/commodities",
            category: "Commodities"
        }
    ];

    const filteredNews = activeCategory === 'All'
        ? news
        : news.filter(item => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-background p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-12 animate-fade-in relative pb-32">

                {/* Header */}
                <div className="border-b border-border pb-8">
                    <h1 className="text-5xl font-black text-foreground mb-4">
                        Market <span className="text-[#00ff9d]">Pulse</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">Curated Indian financial news & expert insights.</p>
                </div>

                {/* Filters & Content */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#00ff9d] rounded-full"></span>
                            Latest News
                        </h2>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                                        ${activeCategory === cat
                                            ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                                            : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNews.map((item, idx) => (
                            <div
                                key={idx}
                                className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,157,0.1)] flex flex-col relative"
                            >
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <span className="absolute bottom-3 left-3 px-2 py-1 bg-[#00ff9d] text-black text-[10px] font-black uppercase tracking-wider rounded">
                                        {item.tag}
                                    </span>
                                    {/* Source Credibility Badge */}
                                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                                        <CheckCircle size={10} className="text-[#00ff9d]" />
                                        <span className="text-[10px] font-medium text-white">{item.credibility}</span>
                                    </div>
                                </a>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText size={12} className="text-[#00ff9d]" />
                                            <span>{item.source}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1"><Clock size={10} /> {item.readTime}</span>
                                        </div>
                                    </div>

                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <h3 className="text-foreground font-bold leading-snug text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                    </a>

                                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between group-hover:border-input transition-colors">
                                        <div className="flex items-center gap-3">
                                            <button className="text-muted-foreground hover:text-primary transition-colors">
                                                <Bookmark size={18} />
                                            </button>
                                            <button className="text-gray-500 hover:text-[#00ff9d] transition-colors">
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                            Read Full <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>



            </div>
        </div>
    );
}
