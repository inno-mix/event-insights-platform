'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const { data } = await apiClient.get('/events');
            return data;
        },
    });
}
