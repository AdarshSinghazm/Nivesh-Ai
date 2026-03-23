'use client';

import ProfileSettings from '@/components/ProfileSettings';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-background p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative">

                <div className="border-b border-border pb-8">
                    <h1 className="text-4xl font-black text-foreground mb-2">
                        Account <span className="text-primary">Settings</span>
                    </h1>
                    <p className="text-muted-foreground">Manage your personal information and application preferences.</p>
                </div>

                <ProfileSettings />

            </div>
        </div>
    );
}
