import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    organizationName: z
        .string()
        .min(2, 'Organization name must be at least 2 characters'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
