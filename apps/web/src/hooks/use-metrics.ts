'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useMetrics(startDate: string, endDate: string) {
    return useQuery({
        queryKey: ['metrics', startDate, endDate],
        queryFn: async () => {
            const { data } = await apiClient.get('/analytics/metrics', {
                params: { startDate, endDate },
            });
            return data;
        },
        refetchInterval: 30 * 1000, // Auto-refresh every 30s
    });
}

export function useMetricsSummary(startDate: string, endDate: string) {
    return useQuery({
        queryKey: ['metrics-summary', startDate, endDate],
        queryFn: async () => {
            const { data } = await apiClient.get('/analytics/summary', {
                params: { startDate, endDate },
            });
            return data;
        },
        refetchInterval: 30 * 1000,
    });
}
