'use client';

import { useState, useEffect } from 'react';

export type RiskLevel = 'low' | 'medium' | 'high';
export type InvestmentGoal = 'retirement' | 'growth' | 'income' | 'speculation';

export interface PortfolioItem {
    symbol: string;
    quantity: number;
    averagePrice: number;
}

export interface UserProfile {
    name: string;
    age: number;
    riskTolerance: RiskLevel;
    goals: InvestmentGoal[];
    timeHorizonYears: number;
    initialInvestment: number;
    hasCompletedOnboarding: boolean;
    portfolio: PortfolioItem[];
}

const defaultProfile: UserProfile = {
    name: '',
    age: 30,
    riskTolerance: 'medium',
    goals: ['growth'],
    timeHorizonYears: 10,
    initialInvestment: 1000,
    hasCompletedOnboarding: false,
    portfolio: [],
};

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from localStorage on mount
        const saved = localStorage.getItem('user_profile');
        if (saved) {
            try {
                // eslint-disable-next-line
                setProfile(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse user profile', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveProfile = (newProfile: UserProfile) => {
        setProfile(newProfile);
        localStorage.setItem('user_profile', JSON.stringify(newProfile));
    };

    return { profile, saveProfile, isLoaded };
}
