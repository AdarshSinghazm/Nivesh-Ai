import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updatedUser = await (prisma.user as any).update({
            where: { email: session.user.email },
            data: {
                isPaidUser: true,
                subscriptionTier: 'premium'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription updated successfully',
            user: {
                email: (updatedUser as any).email,
                isPaidUser: (updatedUser as any).isPaidUser,
                subscriptionTier: (updatedUser as any).subscriptionTier
            }
        });
    } catch (error: any) {
        console.error('Subscription API Error:', error);
        return NextResponse.json({
            error: 'Failed to update subscription',
            details: error.message
        }, { status: 500 });
    }
}
