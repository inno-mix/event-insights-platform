// ─── Analytics Types ───
export interface TrackEventDto {
    eventId: string;
    sessionId?: string;
    payload?: Record<string, unknown>;
    userAgent?: string;
    ipAddress?: string;
}

export interface AggregatedMetric {
    id: string;
    eventId: string;
    orgId: string;
    metricType: MetricType;
    value: number;
    periodStart: string;
    periodEnd: string;
}

export type MetricType = 'TOTAL_COUNT' | 'UNIQUE_SESSIONS' | 'CONVERSIONS';

export interface MetricsQueryDto {
    eventId?: string;
    metricType?: MetricType;
    startDate: string;
    endDate: string;
}

export interface MetricsSummary {
    totalEvents: number;
    uniqueSessions: number;
    conversions: number;
    timeSeriesData: TimeSeriesPoint[];
}

export interface TimeSeriesPoint {
    timestamp: string;
    value: number;
    metricType: MetricType;
}
