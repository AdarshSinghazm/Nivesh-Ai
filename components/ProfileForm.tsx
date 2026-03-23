'use client';

import { useState, useEffect } from 'react';
import { useUserProfile, UserProfile, RiskLevel, InvestmentGoal } from '@/lib/hooks/useUserProfile';
import { useRouter } from 'next/navigation';

import PortfolioManager from './PortfolioManager';

export default function ProfileForm({
    profileData,
    onSave
}: {
    profileData?: UserProfile,
    onSave?: () => void
}) {
    // ... hooks ...
    const { saveProfile, isLoaded } = useUserProfile();
    const router = useRouter();
    const [formData, setFormData] = useState<UserProfile>(profileData || {
        name: '',
        age: 30,
        riskTolerance: 'medium',
        goals: ['growth'],
        timeHorizonYears: 10,
        initialInvestment: 1000,
        hasCompletedOnboarding: false,
        portfolio: [],
    });

    useEffect(() => {
        if (profileData) {
            // eslint-disable-next-line
            setFormData(profileData);
        }
    }, [profileData]);

    if (!isLoaded && !profileData) return <div>Loading...</div>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProfile = { ...formData, hasCompletedOnboarding: true };
        saveProfile(updatedProfile);
        if (onSave) onSave();
        else router.push('/dashboard');
    };

    const toggleGoal = (goal: InvestmentGoal) => {
        const currentGoals = formData.goals;
        if (currentGoals.includes(goal)) {
            setFormData({ ...formData, goals: currentGoals.filter(g => g !== goal) });
        } else {
            setFormData({ ...formData, goals: [...currentGoals, goal] });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Investor Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            type="number"
                            required
                            min="18"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Initial Investment (₹)</label>
                    <input
                        type="number"
                        required
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        value={formData.initialInvestment}
                        onChange={(e) => setFormData({ ...formData, initialInvestment: parseInt(e.target.value) })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                    <div className="flex space-x-4">
                        {(['low', 'medium', 'high'] as RiskLevel[]).map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setFormData({ ...formData, riskTolerance: level })}
                                className={`px-4 py-2 rounded-md capitalize ${formData.riskTolerance === level
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        {formData.riskTolerance === 'low' && 'Prioritize preservation of capital over returns.'}
                        {formData.riskTolerance === 'medium' && 'Balanced approach between growth and safety.'}
                        {formData.riskTolerance === 'high' && 'Maximum growth potential with higher volatility.'}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Goals</label>
                    <div className="flex flex-wrap gap-2">
                        {(['retirement', 'growth', 'income', 'speculation'] as InvestmentGoal[]).map((goal) => (
                            <button
                                key={goal}
                                type="button"
                                onClick={() => toggleGoal(goal)}
                                className={`px-3 py-1 rounded-full text-sm capitalize ${formData.goals.includes(goal)
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Time Horizon (Years): {formData.timeHorizonYears}</label>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        value={formData.timeHorizonYears}
                        onChange={(e) => setFormData({ ...formData, timeHorizonYears: parseInt(e.target.value) })}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {profileData ? 'Update Profile' : 'Start My Journey'}
                    </button>
                </div>
            </form>

            <div className="mt-8 max-w-2xl mx-auto">
                <PortfolioManager />
            </div>
        </>
    );
}
