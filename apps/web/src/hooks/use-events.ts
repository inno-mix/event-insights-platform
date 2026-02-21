'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newEvent: { name: string; type: string; description?: string }) => {
            const { data } = await apiClient.post('/events', newEvent);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}

