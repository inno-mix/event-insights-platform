import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';
import { AggregationProcessor } from './processors/aggregation.processor';
import { RawEvent, RawEventSchema } from './schemas/raw-event.schema';
import { ANALYTICS_LAUNCHER } from '@shared/launchers/analytics.launcher';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RawEvent.name, schema: RawEventSchema },
        ]),
        BullModule.registerQueue({
            name: 'analytics-aggregation',
        }),
    ],
    controllers: [AnalyticsController],
    providers: [
        AnalyticsService,
        AnalyticsRepository,
        AggregationProcessor,
        {
            // Provide the Analytics service via the shared launcher token
            // so other modules can inject it without circular dependencies
            provide: ANALYTICS_LAUNCHER,
            useExisting: AnalyticsService,
        },
    ],
    exports: [ANALYTICS_LAUNCHER],
})
export class AnalyticsModule { }
