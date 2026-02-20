import { z } from 'zod';

export const TrackEventSchema = z.object({
    eventId: z.string().min(1, 'eventId is required'),
    sessionId: z.string().optional(),
    payload: z.record(z.unknown()).optional(),
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
});

export type TrackEventDto = z.infer<typeof TrackEventSchema>;

export const QueryMetricsSchema = z.object({
    eventId: z.string().optional(),
    metricType: z
        .enum(['TOTAL_COUNT', 'UNIQUE_SESSIONS', 'CONVERSIONS'])
        .optional(),
    startDate: z.string().datetime({ message: 'Invalid ISO date' }),
    endDate: z.string().datetime({ message: 'Invalid ISO date' }),
});

export type QueryMetricsDto = z.infer<typeof QueryMetricsSchema>;
