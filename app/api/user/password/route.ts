import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
    try {
        console.log('🔐 Password update request received');
        const session = await getServerSession(authOptions);
        console.log('📧 Session email:', session?.user?.email);

        if (!session?.user?.email) {
            console.log('❌ No session found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();
        console.log('📝 Passwords received - current:', !!currentPassword, 'new:', !!newPassword);

        if (!currentPassword || !newPassword) {
            console.log('❌ Missing passwords');
            return NextResponse.json({ error: 'Both passwords are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            console.log('❌ Password too short');
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        console.log('🔍 Finding user in database...');
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            console.log('❌ User not found in database');
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('✅ User found, verifying password...');
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        console.log('🔑 Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('❌ Current password is incorrect');
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        console.log('🔒 Hashing new password...');
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log('💾 Updating password in database...');
        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        });

        console.log('✅ Password updated successfully!');
        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('💥 Password update error:', error);
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}
