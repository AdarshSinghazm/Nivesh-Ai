export interface SubscriptionStatus {
    isEligible: boolean;
    reason: 'trial' | 'paid' | 'expired';
    daysRemaining: number;
}

export function checkSubscriptionStatus(user: any): SubscriptionStatus {
    if (!user) {
        return { isEligible: false, reason: 'expired', daysRemaining: 0 };
    }

    // 1. Check if user is a paid subscriber
    if (user.isPaidUser || user.subscriptionTier === 'premium') {
        return { isEligible: true, reason: 'paid', daysRemaining: 999 };
    }

    // 2. Check trial status (Fallback to createdAt or now if missing)
    const trialStart = user.trialStartedAt ? new Date(user.trialStartedAt) : new Date(user.createdAt || Date.now());
    const now = new Date();
    const diffTime = now.getTime() - trialStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysRemaining = 3 - diffDays;

    if (daysRemaining > 0) {
        return { isEligible: true, reason: 'trial', daysRemaining };
    }

    return { isEligible: false, reason: 'expired', daysRemaining: 0 };
}
