'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LineChart, PieChart, User, LogOut, Sparkles, MessageSquare, Newspaper, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on navigation mobile
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const navigation = [
        { name: 'Market', href: '/market', icon: LineChart },
        { name: 'AI Assistant', href: '/analyzer', icon: PieChart },
        { name: 'AI Advisor', href: '/ai-chat', icon: MessageSquare },
        { name: 'Profile', href: '/profile', icon: User },
        { name: 'News & Vlogs', href: '/news', icon: Newspaper },
    ];

    return (
        <>
            {/* Mobile Top Header */}
            <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-background/95 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#00ff9d] rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-foreground">
                        Nivesh<span className="text-[#00ff9d]">AI</span>
                    </span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-lg"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={`fixed left-0 top-0 h-screen w-64 bg-background border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}>
                <div className="hidden md:block p-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-[#00ff9d] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.4)]">
                            <Sparkles className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-foreground">
                            Nivesh<span className="text-[#00ff9d]">AI</span>
                        </span>
                    </Link>
                </div>

                {/* Mobile Logo close button area (optional, omitting for clean look) */}
                <div className="md:hidden p-4 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-muted-foreground">Navigation</span>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-secondary rounded-md">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-bold text-gray-500 px-4 py-2 uppercase tracking-wider">Menu</div>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-[#00ff9d] text-black font-bold shadow-[0_0_20px_rgba(0,255,157,0.4)]'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-muted-foreground group-hover:text-primary'}`} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-border space-y-4 bg-background">
                    {session ? (
                        <div className="bg-card rounded-xl p-3 border border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00ff9d] to-blue-500 flex items-center justify-center text-black font-bold text-xs">
                                    {session.user?.name?.[0] || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-foreground truncate">{session.user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#ff4444] hover:bg-[#ff4444]/10 p-2 rounded-lg transition-colors"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-card rounded-xl border border-border">
                            <p className="text-xs text-gray-400 mb-3 block">Sign in to sync your portfolio</p>
                            <Link href="/login" className="flex items-center justify-center w-full py-2 bg-secondary hover:bg-muted text-foreground text-xs font-bold rounded-lg transition-colors">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
