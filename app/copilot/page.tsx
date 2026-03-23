'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { generateInsights, Insight } from '@/lib/services/copilotService';
import InsightCard from '@/components/InsightCard';
import Link from 'next/link';

export default function CopilotPage() {
    const { profile, isLoaded } = useUserProfile();
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (profile && profile.hasCompletedOnboarding) {
                setLoading(true);
                const data = await generateInsights(profile);
                setInsights(data);
                setLoading(false);
            }
        }
        if (isLoaded) load();
    }, [profile, isLoaded]);

    if (!isLoaded) return null;

    if (!profile.hasCompletedOnboarding) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Unlock AI Insights</h1>
                    <p className="mb-6 text-gray-600">Please complete your profile to get personalized recommendations.</p>
                    <Link href="/profile" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        Setup Profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">AI Investment Copilot</h1>
                <p className="mt-2 text-gray-600">
                    Personalized investment strategies based on your <span className="font-semibold">{profile.riskTolerance}</span> risk tolerance and <span className="font-semibold">{profile.goals.join(', ')}</span> goals.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {insights.length > 0 ? (
                        insights.map(insight => (
                            <InsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <p className="text-gray-500">No specific insights found for your profile at this moment. Market conditions change rapidly, check back soon!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
