// ─── Event Types ───
export interface EventDefinition {
    id: string;
    name: string;
    type: EventType;
    description: string | null;
    orgId: string;
    createdAt: string;
    updatedAt: string;
}

export type EventType = 'PAGE_VIEW' | 'CLICK' | 'CONVERSION' | 'CUSTOM';

export interface CreateEventDto {
    name: string;
    type: EventType;
    description?: string;
}

export interface UpdateEventDto {
    name?: string;
    type?: EventType;
    description?: string;
}
