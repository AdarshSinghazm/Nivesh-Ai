'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="w-10 h-10 rounded-xl bg-secondary animate-pulse" />
    );

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(0,255,157,0.4)]"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-muted-foreground group-hover:text-black transition-colors" />
            ) : (
                <Moon className="w-5 h-5 text-muted-foreground group-hover:text-black transition-colors" />
            )}
        </button>
    );
}
