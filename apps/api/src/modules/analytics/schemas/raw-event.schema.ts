import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * RawEvent — MongoDB document for high-throughput event ingestion.
 * This is the write-heavy store; data is aggregated to PostgreSQL
 * via a BullMQ job every 10 minutes.
 */
@Schema({
    collection: 'raw_events',
    timestamps: { createdAt: 'timestamp' },
})
export class RawEvent extends Document {
    @Prop({ required: true, index: true })
    eventId!: string;

    @Prop({ required: true, index: true })
    orgId!: string;

    @Prop()
    sessionId!: string;

    @Prop({ type: Object })
    payload!: Record<string, unknown>;

    @Prop()
    userAgent!: string;

    @Prop()
    ipAddress!: string;

    @Prop({ default: Date.now, index: true })
    timestamp!: Date;

    @Prop({ default: false, index: true })
    aggregated!: boolean;
}

export const RawEventSchema = SchemaFactory.createForClass(RawEvent);

// Compound indexes for efficient aggregation queries
RawEventSchema.index({ orgId: 1, eventId: 1, timestamp: 1 });
RawEventSchema.index({ aggregated: 1, timestamp: 1 });
