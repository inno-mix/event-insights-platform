import {
    PipeTransform,
    Injectable,
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

    transform(value: unknown) {
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
