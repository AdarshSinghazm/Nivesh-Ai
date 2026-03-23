'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Sparkles, User, Bot, ThumbsUp, ThumbsDown, StopCircle } from 'lucide-react';
// import { generateGeminiResponse } from '@/lib/services/geminiService'; // Commented out until key is set

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function AIChatPage() {
    useSession();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your AI Investment Advisor powered by Google Gemini. I can analyze NSE stocks, review portfolios, explain financial concepts, and provide data-driven investment recommendations. Ask me anything about Indian markets!",
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call real AI API
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get AI response');
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('AI Chat Error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="flex-none p-6 border-b border-border bg-background/80 backdrop-blur-md z-10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">AI Advisor</h1>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-muted-foreground">Model: <span className="text-foreground">Gemini Pro Fin-Tuned</span></p>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth z-10">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary text-black'}`}>
                            {msg.role === 'user' ? <User size={18} className="text-foreground" /> : <Sparkles size={18} />}
                        </div>
                        <div className={`flex-1 p-5 rounded-2xl ${msg.role === 'user' ? 'bg-secondary text-foreground rounded-tr-sm' : 'bg-card border border-border text-foreground rounded-tl-sm'}`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider opacity-50">
                                <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {msg.role === 'assistant' && (
                                    <div className="flex gap-2 ml-auto">
                                        <ThumbsUp size={12} className="hover:text-primary cursor-pointer transition-colors" />
                                        <ThumbsDown size={12} className="hover:text-[#ff4444] cursor-pointer transition-colors" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4 max-w-3xl">
                        <div className="flex-none w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black">
                            <Bot size={18} className="animate-pulse" />
                        </div>
                        <div className="p-4 bg-card rounded-2xl border border-border flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
            </main>

            {/* Input Area */}
            <footer className="flex-none p-6 bg-background border-t border-border z-10 transition-colors duration-300">
                <div className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Ask about market trends, specific stocks, or investment strategies..."
                        className="w-full bg-secondary text-foreground p-4 pr-16 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-muted-foreground shadow-lg"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                        {isLoading ? (
                            <button className="p-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg hover:bg-[#ff4444]/20 transition-colors" title="Stop generating">
                                <StopCircle size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="p-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                            >
                                <Send size={20} className="stroke-3" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">
                    AI can make mistakes. Consider checking important information.
                </p>
            </footer>
        </div>
    );
}
