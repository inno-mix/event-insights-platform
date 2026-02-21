import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

/**
 * ZodValidationPipe — Generic validation pipe using Zod schemas.
 *
 * Usage:
 *   @UsePipes(new ZodValidationPipe(MyZodSchema))
 *   @Post()
 *   create(@Body() dto: MyDto) { ... }
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        // Only validate standard payloads (body, query, param).
        // Skip custom decorators (like @OrgId, @CurrentUser) to prevent unexpected type errors.
        if (metadata.type === 'custom') {
            return value;
        }

        try {
            return this.schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.errors.map(
                    (e) => `${e.path.join('.')}: ${e.message}`,
                );
                throw new BadRequestException({
                    message: 'Validation failed',
                    errors: messages,
                });
            }
            throw new BadRequestException('Validation failed');
        }
    }
}
