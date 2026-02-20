import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';

import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { RawEventRepository } from './repositories/raw-event.repository';
import { AggregatedMetricRepository } from './repositories/aggregated-metric.repository';
import { AggregationProcessor } from './processors/aggregation.processor';
import { RawEvent, RawEventSchema } from './schemas/raw-event.schema';
import { ANALYTICS_LAUNCHER } from '@shared/launchers/analytics.launcher';

/**
 * AnalyticsModule — Dual-provider architecture.
 *
 * ┌───────────────────────┐      ┌──────────────────────────────┐
 * │  RawEventRepository   │      │  AggregatedMetricRepository  │
 * │  (Mongoose / MongoDB) │      │  (Prisma / PostgreSQL)       │
 * │                       │      │                              │
 * │  • insertRawEvent     │      │  • upsertAggregatedMetric    │
 * │  • findUnaggregated   │      │  • queryMetrics              │
 * │  • markAsAggregated   │      │  • getMetricsSummary         │
 * └───────────────────────┘      └──────────────────────────────┘
 *            ▲                              ▲
 *            │                              │
 *     AnalyticsService (orchestrates both providers)
 */
@Module({
    imports: [
        // Mongoose – registers the RawEvent schema for MongoDB
        MongooseModule.forFeature([
            { name: RawEvent.name, schema: RawEventSchema },
        ]),
        // BullMQ – registers the aggregation queue backed by Redis
        BullModule.registerQueue({
            name: 'analytics-aggregation',
        }),
    ],
    controllers: [AnalyticsController],
    providers: [
        // ─── Mongoose provider (raw writes) ───
        RawEventRepository,

        // ─── Prisma provider (aggregated reads) ───
        AggregatedMetricRepository,

        // ─── Service (orchestrates both) ───
        AnalyticsService,

        // ─── BullMQ Worker ───
        AggregationProcessor,

        // ─── Shared launcher token (cross-module DI) ───
        {
            provide: ANALYTICS_LAUNCHER,
            useExisting: AnalyticsService,
        },
    ],
    exports: [ANALYTICS_LAUNCHER],
})
export class AnalyticsModule { }
