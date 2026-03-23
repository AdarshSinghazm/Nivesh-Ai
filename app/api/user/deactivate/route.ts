import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: 'Password is required to deactivate account' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }

        // Delete the user account
        await prisma.user.delete({
            where: { email: session.user.email },
        });

        return NextResponse.json({ success: true, message: 'Account deactivated successfully' });
    } catch (error) {
        console.error('Account deactivation error:', error);
        return NextResponse.json({ error: 'Failed to deactivate account' }, { status: 500 });
    }
}
