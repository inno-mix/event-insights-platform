'use client';

import { useState, useMemo } from 'react';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { MetricCard } from '@/components/charts/metric-card';
import { Card } from '@/components/ui/card';
import { useMetrics, useMetricsSummary } from '@/hooks/use-metrics';
import { Activity, Timer, TrendingUp } from 'lucide-react';

// Demo data
const demoBarData = [
    { label: 'Mon', value: 1240 },
    { label: 'Tue', value: 1580 },
    { label: 'Wed', value: 2100 },
    { label: 'Thu', value: 1890 },
    { label: 'Fri', value: 2340 },
    { label: 'Sat', value: 980 },
    { label: 'Sun', value: 760 },
];

const demoLineData = [
    { label: 'Week 1', value: 4200 },
    { label: 'Week 2', value: 5100 },
    { label: 'Week 3', value: 4800 },
    { label: 'Week 4', value: 6200 },
];

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('7d');

    const { start, end } = useMemo(() => {
        const end = new Date();
        const start = new Date();
        if (dateRange === '7d') start.setDate(start.getDate() - 7);
        if (dateRange === '30d') start.setDate(start.getDate() - 30);
        if (dateRange === '90d') start.setDate(start.getDate() - 90);
        return { start: start.toISOString(), end: end.toISOString() };
    }, [dateRange]);

    const { data: summary } = useMetricsSummary(start, end);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400 mt-1">
                        Deep dive into your event metrics
                    </p>
                </div>

                {/* Date Range Selector */}
                <div className="flex items-center gap-1 glass-card !p-1 w-full sm:w-auto overflow-x-auto">
                    {['7d', '30d', '90d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${dateRange === range
                                ? 'bg-brand-600/30 text-brand-400'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    title="Total Events"
                    value={summary?.totalEvents?.toLocaleString() || '24,891'}
                    change={15.3}
                    icon={<Activity className="w-6 h-6" />}
                    color="indigo"
                />
                <MetricCard
                    title="Avg. Events / Hour"
                    value={
                        summary
                            ? Math.round(summary.totalEvents / (parseInt(dateRange) * 24)).toLocaleString()
                            : '148'
                    }
                    change={4.2}
                    icon={<Timer className="w-6 h-6" />}
                    color="emerald"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={
                        summary && summary.totalEvents > 0
                            ? `${((summary.conversions / summary.totalEvents) * 100).toFixed(1)}%`
                            : '6.8%'
                    }
                    change={1.1}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="amber"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart
                    data={demoBarData}
                    title="Events by Day of Week"
                    color="#6366F1"
                    height={300}
                />
                <LineChart
                    data={demoLineData}
                    title="Weekly Trend"
                    color="#10B981"
                    height={300}
                />
            </div>

            {/* Raw Data Info */}
            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-sm text-gray-400">
                        <span className="text-gray-200 font-medium">
                            Analytics pipeline active
                        </span>{' '}
                        — Data aggregates every 10 minutes via BullMQ. Dashboard queries
                        PostgreSQL for sub-second load times.
                    </p>
                </div>
            </Card>
        </div>
    );
}
