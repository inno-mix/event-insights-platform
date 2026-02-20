import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RawEventRepository } from '../repositories/raw-event.repository';
import { AggregatedMetricRepository } from '../repositories/aggregated-metric.repository';

/**
 * AggregationProcessor — BullMQ worker that runs every 10 minutes.
 *
 * Pipeline:
 *   1. RawEventRepository.findUnaggregatedEvents()     → reads from MongoDB
 *   2. Groups events by orgId + eventId + hour
 *   3. AggregatedMetricRepository.upsertAggregatedMetric() → writes to PostgreSQL
 *   4. RawEventRepository.markEventsAsAggregated()      → marks in MongoDB
 */
@Processor('analytics-aggregation')
export class AggregationProcessor extends WorkerHost {
    private readonly logger = new Logger(AggregationProcessor.name);

    constructor(
        private readonly rawEventRepo: RawEventRepository,
        private readonly aggregatedMetricRepo: AggregatedMetricRepository,
    ) {
        super();
    }

    async process(job: Job): Promise<void> {
        this.logger.log(`Starting aggregation job ${job.id}`);

        const rawEvents = await this.rawEventRepo.findUnaggregatedEvents();

        if (rawEvents.length === 0) {
            this.logger.log('No events to aggregate');
            return;
        }

        this.logger.log(`Aggregating ${rawEvents.length} raw events`);

        // Group events by orgId + eventId + hour
        const aggregationMap = new Map<
            string,
            {
                eventId: string;
                orgId: string;
                totalCount: number;
                uniqueSessions: Set<string>;
                periodStart: Date;
                periodEnd: Date;
            }
        >();

        for (const event of rawEvents) {
            const hourStart = new Date(event.timestamp);
            hourStart.setMinutes(0, 0, 0);
            const hourEnd = new Date(hourStart);
            hourEnd.setHours(hourEnd.getHours() + 1);

            const key = `${event.orgId}:${event.eventId}:${hourStart.toISOString()}`;

            if (!aggregationMap.has(key)) {
                aggregationMap.set(key, {
                    eventId: event.eventId,
                    orgId: event.orgId,
                    totalCount: 0,
                    uniqueSessions: new Set<string>(),
                    periodStart: hourStart,
                    periodEnd: hourEnd,
                });
            }

            const bucket = aggregationMap.get(key)!;
            bucket.totalCount++;
            if (event.sessionId) {
                bucket.uniqueSessions.add(event.sessionId);
            }
        }

        // Upsert aggregated metrics to PostgreSQL
        for (const [, bucket] of aggregationMap) {
            await this.aggregatedMetricRepo.upsertAggregatedMetric({
                eventId: bucket.eventId,
                orgId: bucket.orgId,
                metricType: 'TOTAL_COUNT',
                value: bucket.totalCount,
                periodStart: bucket.periodStart,
                periodEnd: bucket.periodEnd,
            });

            await this.aggregatedMetricRepo.upsertAggregatedMetric({
                eventId: bucket.eventId,
                orgId: bucket.orgId,
                metricType: 'UNIQUE_SESSIONS',
                value: bucket.uniqueSessions.size,
                periodStart: bucket.periodStart,
                periodEnd: bucket.periodEnd,
            });
        }

        // Mark raw events as aggregated in MongoDB
        const eventIds = rawEvents.map((e) => e._id.toString());
        await this.rawEventRepo.markEventsAsAggregated(eventIds);

        this.logger.log(
            `Aggregation complete: ${rawEvents.length} events → ${aggregationMap.size} buckets`,
        );
    }
}
