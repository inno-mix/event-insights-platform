import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from '@infra/prisma/prisma.service';
import { RawEvent } from './schemas/raw-event.schema';
import { TrackEventDto } from './dto/query-metrics.dto';

@Injectable()
export class AnalyticsRepository {
    private readonly logger = new Logger(AnalyticsRepository.name);

    constructor(
        @InjectModel(RawEvent.name) private readonly rawEventModel: Model<RawEvent>,
        private readonly prisma: PrismaService,
    ) { }

    // ─── MongoDB Write (Ingestion) ───
    async insertRawEvent(data: TrackEventDto & { orgId: string }): Promise<void> {
        await this.rawEventModel.create({
            eventId: data.eventId,
            orgId: data.orgId,
            sessionId: data.sessionId,
            payload: data.payload,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
        });
    }

    // ─── MongoDB Read (For Aggregation) ───
    async findUnaggregatedEvents(limit = 10000): Promise<RawEvent[]> {
        return this.rawEventModel
            .find({ aggregated: false })
            .sort({ timestamp: 1 })
            .limit(limit)
            .exec();
    }

    async markEventsAsAggregated(eventIds: string[]): Promise<void> {
        await this.rawEventModel.updateMany(
            { _id: { $in: eventIds } },
            { $set: { aggregated: true } },
        );
    }

    // ─── PostgreSQL Write (Aggregated Storage) ───
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

    // ─── PostgreSQL Read (Dashboard Serving) ───
    async queryMetrics(orgId: string, params: {
        eventId?: string;
        metricType?: 'TOTAL_COUNT' | 'UNIQUE_SESSIONS' | 'CONVERSIONS';
        startDate: Date;
        endDate: Date;
    }) {
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

    async getMetricsSummary(orgId: string, startDate: Date, endDate: Date) {
        const [totalCount, uniqueSessions, conversions] = await Promise.all([
            this.prisma.aggregatedMetric.aggregate({
                where: { orgId, metricType: 'TOTAL_COUNT', periodStart: { gte: startDate }, periodEnd: { lte: endDate } },
                _sum: { value: true },
            }),
            this.prisma.aggregatedMetric.aggregate({
                where: { orgId, metricType: 'UNIQUE_SESSIONS', periodStart: { gte: startDate }, periodEnd: { lte: endDate } },
                _sum: { value: true },
            }),
            this.prisma.aggregatedMetric.aggregate({
                where: { orgId, metricType: 'CONVERSIONS', periodStart: { gte: startDate }, periodEnd: { lte: endDate } },
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
