import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('Invalid credentials');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid credentials');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    trialStartedAt: (user as unknown as { trialStartedAt: Date }).trialStartedAt,
                    isPaidUser: (user as unknown as { isPaidUser: boolean }).isPaidUser,
                    subscriptionTier: (user as unknown as { subscriptionTier: string }).subscriptionTier,
                };
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.trialStartedAt = (user as { trialStartedAt?: Date }).trialStartedAt;
                token.isPaidUser = (user as { isPaidUser?: boolean }).isPaidUser;
                token.subscriptionTier = (user as { subscriptionTier?: string }).subscriptionTier;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as unknown as { id: string }).id = token.id as string;
                (session.user as unknown as { trialStartedAt?: Date }).trialStartedAt = token.trialStartedAt as Date;
                (session.user as unknown as { isPaidUser?: boolean }).isPaidUser = token.isPaidUser as boolean;
                (session.user as unknown as { subscriptionTier?: string }).subscriptionTier = token.subscriptionTier as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-development-secret-change-in-production',
};
