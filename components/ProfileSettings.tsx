'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Bell, Settings, Shield, Moon, Sun, Monitor, LogOut, CheckCircle, Smartphone, Mail, Globe } from 'lucide-react';

export default function ProfileSettings() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('personal');

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'account', label: 'Account Details', icon: Shield },
    ];

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '+91 98765 43210',
        currency: 'INR',
        timezone: 'IST',
        emailNotifs: true,
        inAppNotifs: true,
        twoFactor: false
    });

    // Update form data when session loads
    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                fullName: session.user?.name || '',
                email: session.user?.email || '',
            }));
        }
    }, [session]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [deactivatePassword, setDeactivatePassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Dropdown toggles
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [showDeactivate, setShowDeactivate] = useState(false);

    const handleSaveProfile = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    mobile: formData.mobile
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setLoading(false);
            return;
        }

        if (!passwordData.currentPassword || !passwordData.newPassword) {
            setMessage({ type: 'error', text: 'Please fill in all password fields' });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Show the actual error message from the API
                throw new Error(data.error || `Server error: ${res.status}`);
            }

            setMessage({ type: 'success', text: data.message || 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error('Password change error:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateAccount = async () => {
        if (!confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/deactivate', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: deactivatePassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to deactivate account');
            }

            setMessage({ type: 'success', text: 'Account deactivated. Redirecting...' });

            // Sign out and redirect
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-muted/10 border-r border-border p-4">
                <div className="flex flex-col gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-secondary text-primary border border-border shadow-sm'
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8">
                <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">

                    {/* Header */}
                    <div className="flex flex-col gap-2 border-b border-border pb-6">
                        <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                            {tabs.find(t => t.id === activeTab)?.icon && (
                                <span className="text-primary">
                                    {(() => {
                                        const Icon = tabs.find(t => t.id === activeTab)?.icon;
                                        return Icon ? <Icon size={24} /> : null;
                                    })()}
                                </span>
                            )}
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-muted-foreground text-sm">Manage your profile settings and preferences.</p>
                    </div>

                    {/* Personal Information */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-4xl font-bold text-black border-4 border-card shadow-lg">
                                    {formData.fullName?.[0] || 'U'}
                                </div>
                                <div className="space-y-2">
                                    <button className="bg-secondary hover:bg-muted text-foreground px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                                        Change Picture
                                    </button>
                                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-input/50 md:bg-input/20 hover:bg-input/30 border border-border rounded-xl py-2.5 pl-10 pr-4 text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-muted-foreground text-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Mobile Number (Optional)</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                        <input
                                            type="text"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            className="w-full bg-input/50 md:bg-input/20 hover:bg-input/30 border border-border rounded-xl py-2.5 pl-10 pr-4 text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Success/Error Message */}
                            {message.text && (
                                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                                    <p className="text-sm font-bold">{message.text}</p>
                                </div>
                            )}

                            {/* Save Button */}
                            <button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-black py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}


                    {/* Preferences */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Preferred Currency</label>
                                    <select
                                        className="w-full bg-input/50 md:bg-input/20 border border-border rounded-xl py-2.5 px-4 text-foreground text-sm focus:border-primary focus:outline-none"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option value="INR">₹ INR (Indian Rupee)</option>
                                        <option value="USD">$ USD (US Dollar)</option>
                                        <option value="EUR">€ EUR (Euro)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Timezone</label>
                                    <select
                                        className="w-full bg-input/50 md:bg-input/20 border border-border rounded-xl py-2.5 px-4 text-foreground text-sm focus:border-primary focus:outline-none"
                                        value={formData.timezone}
                                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                    >
                                        <option value="IST">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                        <option value="GMT">(GMT+00:00) London</option>
                                        <option value="EST">(GMT-05:00) Eastern Time (US & Canada)</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center">
                                        <Mail size={20} className="text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground">Email Notifications</h3>
                                        <p className="text-xs text-muted-foreground">Receive daily summaries and critical alerts.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFormData({ ...formData, emailNotifs: !formData.emailNotifs })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.emailNotifs ? 'bg-primary' : 'bg-secondary border border-border'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.emailNotifs ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center">
                                        <Bell size={20} className="text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground">In-App Notifications</h3>
                                        <p className="text-xs text-muted-foreground">Real-time alerts within the dashboard.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFormData({ ...formData, inAppNotifs: !formData.inAppNotifs })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.inAppNotifs ? 'bg-primary' : 'bg-secondary border border-border'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.inAppNotifs ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Account Details Tab with Collapsible Sections */}
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                    <input
                                        type="text"
                                        value={formData.fullName.replace(/\s+/g, '').toLowerCase()}
                                        disabled
                                        className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-muted-foreground text-sm cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Password Reset Section - Collapsible */}
                            <div className="border border-border rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setShowPasswordReset(!showPasswordReset)}
                                    className="w-full p-4 bg-secondary hover:bg-muted flex items-center justify-between transition-colors"
                                >
                                    <div className="text-left">
                                        <h3 className="text-sm font-bold text-foreground mb-1">Password</h3>
                                        <p className="text-xs text-muted-foreground">Change your account password</p>
                                    </div>
                                    <Lock size={16} className={`text-muted-foreground transition-transform ${showPasswordReset ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showPasswordReset && (
                                    <div className="p-4 bg-card border-t border-border space-y-3">
                                        <input
                                            type="password"
                                            placeholder="Current Password"
                                            className="w-full bg-input/50 md:bg-input/20 border border-border rounded-xl py-2.5 px-4 text-foreground text-sm focus:border-primary focus:outline-none"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        />
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            className="w-full bg-input/50 md:bg-input/20 border border-border rounded-xl py-2.5 px-4 text-foreground text-sm focus:border-primary focus:outline-none"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm New Password"
                                            className="w-full bg-input/50 md:bg-input/20 border border-border rounded-xl py-2.5 px-4 text-foreground text-sm focus:border-primary focus:outline-none"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        />
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={loading}
                                            className="w-full bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Updating...' : 'Reset Password'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Account Deactivation Section - Collapsible */}
                            <div className="border border-red-500/30 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setShowDeactivate(!showDeactivate)}
                                    className="w-full p-4 bg-red-500/10 hover:bg-red-500/20 flex items-center justify-between transition-colors"
                                >
                                    <div className="text-left">
                                        <h3 className="text-sm font-bold text-red-500 mb-1 flex items-center gap-2">
                                            <LogOut size={14} /> Deactivate Account
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Permanently delete your account</p>
                                    </div>
                                    <Lock size={16} className={`text-red-500 transition-transform ${showDeactivate ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showDeactivate && (
                                    <div className="p-4 bg-card border-t border-red-500/30 space-y-3">
                                        <p className="text-xs text-muted-foreground">
                                            Once you deactivate your account, all your data will be permanently deleted. This action cannot be undone.
                                        </p>
                                        <input
                                            type="password"
                                            placeholder="Enter your password to confirm"
                                            className="w-full bg-secondary border border-border rounded-xl py-2.5 px-4 text-foreground text-sm focus:border-red-500 focus:outline-none"
                                            value={deactivatePassword}
                                            onChange={(e) => setDeactivatePassword(e.target.value)}
                                        />
                                        <button
                                            onClick={handleDeactivateAccount}
                                            disabled={loading || !deactivatePassword}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Deactivating...' : 'Deactivate Account'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Success/Error Message */}
                            {message.text && (
                                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                                    <p className="text-sm font-bold">{message.text}</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
