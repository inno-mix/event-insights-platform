import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AnalyticsRepository } from './analytics.repository';
import { TrackEventDto, QueryMetricsDto } from './dto/query-metrics.dto';
import { IAnalyticsLauncher } from '@shared/launchers/analytics.launcher';

@Injectable()
export class AnalyticsService implements IAnalyticsLauncher {
    private readonly logger = new Logger(AnalyticsService.name);

    constructor(
        private readonly repository: AnalyticsRepository,
        @InjectQueue('analytics-aggregation')
        private readonly aggregationQueue: Queue,
    ) {
        // Schedule the aggregation job to run every 10 minutes
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

    // ─── Ingestion (Write to MongoDB) ───
    async trackEvent(data: TrackEventDto & { orgId: string }): Promise<void> {
        await this.repository.insertRawEvent(data);
    }

    // ─── Serving (Read from PostgreSQL) ───
    async queryMetrics(orgId: string, query: QueryMetricsDto) {
        return this.repository.queryMetrics(orgId, {
            eventId: query.eventId,
            metricType: query.metricType,
            startDate: new Date(query.startDate),
            endDate: new Date(query.endDate),
        });
    }

    async getMetricsSummary(orgId: string, startDate: string, endDate: string) {
        return this.repository.getMetricsSummary(
            orgId,
            new Date(startDate),
            new Date(endDate),
        );
    }
}
