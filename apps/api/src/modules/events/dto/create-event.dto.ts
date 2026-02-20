import { z } from 'zod';

export const CreateEventSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    type: z.enum(['PAGE_VIEW', 'CLICK', 'CONVERSION', 'CUSTOM']).default('CUSTOM'),
    description: z.string().optional(),
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;
