'use client';

import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
    data: { label: string; value: number }[];
    title?: string;
    color?: string;
    height?: number;
}

export function LineChart({
    data,
    title,
    color = '#6366F1',
    height = 300,
}: LineChartProps) {
    return (
        <div className="glass-card p-6">
            {title && (
                <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
            )}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#252830" />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        axisLine={{ stroke: '#252830' }}
                    />
                    <YAxis
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        axisLine={{ stroke: '#252830' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1A1D27',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#F3F4F6',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: color }}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}
