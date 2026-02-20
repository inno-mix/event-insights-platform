import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';

/**
 * AggregatedMetricRepository — Prisma-backed provider for AGGREGATED READS.
 *
 * Handles all PostgreSQL interactions for the analytics pipeline:
 *   - Upserting hourly aggregated metrics (from the BullMQ worker)
 *   - Querying metrics for the dashboard (sub-second reads)
 *   - Computing summary KPIs (total events, unique sessions, conversions)
 */
@Injectable()
export class AggregatedMetricRepository {
    private readonly logger = new Logger(AggregatedMetricRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    // ─── Aggregated Write (from BullMQ worker) ───
    async upsertAggregatedMetric(data: {
        eventId: string;
        orgId: string;
        metricType: 'TOTAL_COUNT' | 'UNIQUE_SESSIONS' | 'CONVERSIONS';
        value: number;
        periodStart: Date;
        periodEnd: Date;
    }): Promise<void> {
        await this.prisma.aggregatedMetric.upsert({
            where: {
                eventId_orgId_metricType_periodStart: {
                    eventId: data.eventId,
                    orgId: data.orgId,
                    metricType: data.metricType,
                    periodStart: data.periodStart,
                },
            },
            update: {
                value: { increment: data.value },
            },
            create: {
                eventId: data.eventId,
                orgId: data.orgId,
                metricType: data.metricType,
                value: data.value,
                periodStart: data.periodStart,
                periodEnd: data.periodEnd,
            },
        });
    }

    // ─── Dashboard Query (Read) ───
    async queryMetrics(
        orgId: string,
        params: {
            eventId?: string;
            metricType?: 'TOTAL_COUNT' | 'UNIQUE_SESSIONS' | 'CONVERSIONS';
            startDate: Date;
            endDate: Date;
        },
    ) {
        return this.prisma.aggregatedMetric.findMany({
            where: {
                orgId,
                ...(params.eventId && { eventId: params.eventId }),
                ...(params.metricType && { metricType: params.metricType }),
                periodStart: { gte: params.startDate },
                periodEnd: { lte: params.endDate },
            },
            orderBy: { periodStart: 'asc' },
        });
    }

    // ─── Summary KPIs ───
    async getMetricsSummary(orgId: string, startDate: Date, endDate: Date) {
        const [totalCount, uniqueSessions, conversions] = await Promise.all([
            this.prisma.aggregatedMetric.aggregate({
                where: {
                    orgId,
                    metricType: 'TOTAL_COUNT',
                    periodStart: { gte: startDate },
                    periodEnd: { lte: endDate },
                },
                _sum: { value: true },
            }),
            this.prisma.aggregatedMetric.aggregate({
                where: {
                    orgId,
                    metricType: 'UNIQUE_SESSIONS',
                    periodStart: { gte: startDate },
                    periodEnd: { lte: endDate },
                },
                _sum: { value: true },
            }),
            this.prisma.aggregatedMetric.aggregate({
                where: {
                    orgId,
                    metricType: 'CONVERSIONS',
                    periodStart: { gte: startDate },
                    periodEnd: { lte: endDate },
                },
                _sum: { value: true },
            }),
        ]);

        return {
            totalEvents: totalCount._sum.value || 0,
            uniqueSessions: uniqueSessions._sum.value || 0,
            conversions: conversions._sum.value || 0,
        };
    }
}
