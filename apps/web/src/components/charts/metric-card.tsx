'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color?: 'indigo' | 'emerald' | 'amber' | 'rose';
}

const colorMap = {
    indigo: 'from-brand-500/20 to-brand-600/5 border-brand-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
    rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/20',
};

const iconColorMap = {
    indigo: 'text-brand-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
};

export function MetricCard({
    title,
    value,
    change,
    icon,
    color = 'indigo',
}: MetricCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 ${colorMap[color]} animate-slide-up`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                    {change !== undefined && (
                        <div className="mt-2 flex items-center gap-1">
                            {change > 0 ? (
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            ) : change < 0 ? (
                                <TrendingDown className="w-4 h-4 text-rose-400" />
                            ) : (
                                <Minus className="w-4 h-4 text-gray-400" />
                            )}
                            <span
                                className={`text-sm font-medium ${change > 0
                                        ? 'text-emerald-400'
                                        : change < 0
                                            ? 'text-rose-400'
                                            : 'text-gray-400'
                                    }`}
                            >
                                {Math.abs(change)}%
                            </span>
                            <span className="text-xs text-gray-500">vs last period</span>
                        </div>
                    )}
                </div>
                <div className={`${iconColorMap[color]}`}>{icon}</div>
            </div>
        </div>
    );
}
