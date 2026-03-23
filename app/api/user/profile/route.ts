import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
    try {
        console.log('👤 Profile update request received');
        const session = await getServerSession(authOptions);
        console.log('📧 Session email:', session?.user?.email);

        if (!session?.user?.email) {
            console.log('❌ No session found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, mobile } = await req.json();
        console.log('📝 Update data - name:', name, 'mobile:', mobile);

        console.log('💾 Updating user in database...');
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: name || undefined,
                // Note: mobile field is not in schema yet, skipping
            },
        });

        console.log('✅ Profile updated successfully!');
        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
            },
        });
    } catch (error) {
        console.error('💥 Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
