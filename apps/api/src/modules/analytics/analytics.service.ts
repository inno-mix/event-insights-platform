import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RawEventRepository } from './repositories/raw-event.repository';
import { AggregatedMetricRepository } from './repositories/aggregated-metric.repository';
import { TrackEventDto, QueryMetricsDto } from './dto/query-metrics.dto';
import { IAnalyticsLauncher } from '@shared/launchers/analytics.launcher';

/**
 * AnalyticsService — Orchestrates the analytics pipeline.
 *
 * ┌──────────────┐      ┌───────────────────────┐      ┌────────────────────────────┐
 * │ trackEvent() │─────▶│  RawEventRepository   │─────▶│  MongoDB (raw writes)      │
 * └──────────────┘      │  (Mongoose provider)  │      └────────────────────────────┘
 *                       └───────────────────────┘
 *
 * ┌───────────────────┐ ┌──────────────────────────────┐ ┌──────────────────────────┐
 * │ queryMetrics()    │▶│ AggregatedMetricRepository   │▶│ PostgreSQL (fast reads)   │
 * │ getMetricsSummary │ │ (Prisma provider)            │ └──────────────────────────┘
 * └───────────────────┘ └──────────────────────────────┘
 */
@Injectable()
export class AnalyticsService implements IAnalyticsLauncher {
    private readonly logger = new Logger(AnalyticsService.name);

    constructor(
        private readonly rawEventRepo: RawEventRepository,
        private readonly aggregatedMetricRepo: AggregatedMetricRepository,
        @InjectQueue('analytics-aggregation')
        private readonly aggregationQueue: Queue,
    ) {
        this.setupRecurringAggregation();
    }

    private async setupRecurringAggregation(): Promise<void> {
        // Remove any existing repeatable jobs to avoid duplicates
        const repeatableJobs = await this.aggregationQueue.getRepeatableJobs();
        for (const job of repeatableJobs) {
            await this.aggregationQueue.removeRepeatableByKey(job.key);
        }

        // Add a repeatable job every 10 minutes
        await this.aggregationQueue.add(
            'aggregate-events',
            {},
            {
                repeat: {
                    every: 10 * 60 * 1000, // 10 minutes
                },
            },
        );

        this.logger.log('Aggregation job scheduled: every 10 minutes');
    }

    // ─── Ingestion (Write to MongoDB via RawEventRepository) ───
    async trackEvent(data: TrackEventDto & { orgId: string }): Promise<void> {
        await this.rawEventRepo.insertRawEvent(data);
    }

    // ─── Serving (Read from PostgreSQL via AggregatedMetricRepository) ───
    async queryMetrics(orgId: string, query: QueryMetricsDto) {
        return this.aggregatedMetricRepo.queryMetrics(orgId, {
            eventId: query.eventId,
            metricType: query.metricType,
            startDate: new Date(query.startDate),
            endDate: new Date(query.endDate),
        });
    }

    async getMetricsSummary(orgId: string, startDate: string, endDate: string) {
        return this.aggregatedMetricRepo.getMetricsSummary(
            orgId,
            new Date(startDate),
            new Date(endDate),
        );
    }
}
