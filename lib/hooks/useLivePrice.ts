import { useState, useEffect } from 'react';
import { LiveStockData } from '../services/liveDataService';

export function useLivePrice(symbol: string, intervalMs: number = 5000) {
    const [data, setData] = useState<LiveStockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [flash, setFlash] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPrice = async () => {
            try {
                const response = await fetch(`/api/live-price?symbol=${symbol}`);
                if (!response.ok) throw new Error('Failed to fetch');

                const newData: LiveStockData = await response.json();

                if (isMounted) {
                    // Flash animation on price change
                    if (data && newData.price !== data.price) {
                        setFlash(newData.price > data.price ? 'up' : 'down');
                        setTimeout(() => setFlash(null), 500);
                    }

                    setData(newData);
                    setLoading(false);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to fetch live price');
                    setLoading(false);
                }
            }
        };

        // Initial fetch
        fetchPrice();

        // Poll for updates
        const interval = setInterval(fetchPrice, intervalMs);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [symbol, intervalMs]);

    return { data, loading, error, flash };
}
