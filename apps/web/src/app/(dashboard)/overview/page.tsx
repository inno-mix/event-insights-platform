'use client';

import { useMemo } from 'react';
import { Activity, Users, MousePointerClick, BarChart3 } from 'lucide-react';
import { MetricCard } from '@/components/charts/metric-card';
import { LineChart } from '@/components/charts/line-chart';
import { useMetricsSummary } from '@/hooks/use-metrics';

// Demo data — replaced by real API data when backend is running
const demoTimeSeries = [
    { label: '00:00', value: 120 },
    { label: '04:00', value: 85 },
    { label: '08:00', value: 340 },
    { label: '12:00', value: 520 },
    { label: '16:00', value: 480 },
    { label: '20:00', value: 290 },
    { label: '23:59', value: 150 },
];

export default function OverviewPage() {
    const { start, end } = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        return { start: startOfDay.toISOString(), end: now.toISOString() };
    }, []);

    const { data: summary } = useMetricsSummary(start, end);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-400 mt-1">
                    Real-time insights into your event analytics
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Events"
                    value={summary?.totalEvents?.toLocaleString() || '12,847'}
                    change={12.5}
                    icon={<Activity className="w-6 h-6" />}
                    color="indigo"
                />
                <MetricCard
                    title="Unique Sessions"
                    value={summary?.uniqueSessions?.toLocaleString() || '3,421'}
                    change={8.2}
                    icon={<Users className="w-6 h-6" />}
                    color="emerald"
                />
                <MetricCard
                    title="Conversions"
                    value={summary?.conversions?.toLocaleString() || '842'}
                    change={-2.1}
                    icon={<MousePointerClick className="w-6 h-6" />}
                    color="amber"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={
                        summary
                            ? `${((summary.conversions / summary.totalEvents) * 100).toFixed(1)}%`
                            : '6.5%'
                    }
                    change={0.8}
                    icon={<BarChart3 className="w-6 h-6" />}
                    color="rose"
                />
            </div>

            {/* Chart */}
            <LineChart
                data={demoTimeSeries}
                title="Events Over Time (Today)"
                color="#6366F1"
                height={350}
            />
        </div>
    );
}
