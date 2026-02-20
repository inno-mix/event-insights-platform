import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawEvent } from '../schemas/raw-event.schema';
import { TrackEventDto } from '../dto/query-metrics.dto';

/**
 * RawEventRepository — Mongoose-backed provider for RAW WRITES.
 *
 * Handles all MongoDB interactions for the analytics pipeline:
 *   - High-throughput event ingestion
 *   - Reading un-aggregated events (consumed by the BullMQ worker)
 *   - Marking events as aggregated after processing
 */
@Injectable()
export class RawEventRepository {
    private readonly logger = new Logger(RawEventRepository.name);

    constructor(
        @InjectModel(RawEvent.name)
        private readonly rawEventModel: Model<RawEvent>,
    ) { }

    // ─── Ingestion (Write) ───
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

    // ─── Aggregation Read ───
    async findUnaggregatedEvents(limit = 10000): Promise<RawEvent[]> {
        return this.rawEventModel
            .find({ aggregated: false })
            .sort({ timestamp: 1 })
            .limit(limit)
            .exec();
    }

    // ─── Post-Aggregation Mark ───
    async markEventsAsAggregated(eventIds: string[]): Promise<void> {
        await this.rawEventModel.updateMany(
            { _id: { $in: eventIds } },
            { $set: { aggregated: true } },
        );
    }
}
