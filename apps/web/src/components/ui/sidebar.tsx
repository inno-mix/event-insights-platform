'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import {
    LayoutDashboard,
    Zap,
    BarChart3,
    LogOut,
    Settings,
} from 'lucide-react';

const navItems = [
    { href: '/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/events', label: 'Events', icon: Zap },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

interface SidebarProps {
    currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
    const { user, logout } = useAuth();

    return (
        <aside className="w-64 h-screen flex flex-col bg-surface-raised border-r border-white/5">
            {/* Brand */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-sm">Event Insights</h2>
                        <p className="text-xs text-gray-500">Platform</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = currentPath === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-brand-600/20 text-brand-400'
                                    : 'text-gray-400 hover:text-gray-100 hover:bg-surface-overlay'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center text-brand-400 text-sm font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email || ''}
                        </p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
