import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

/**
 * OrgIdInterceptor — Extracts `x-org-id` from incoming request headers
 * and attaches it to `request.orgId` so that downstream guards, decorators
 * (@OrgId()), and services can access the tenant context.
 *
 * This runs BEFORE guards and pipes, making the orgId available as early
 * as possible in the request lifecycle. If no header is present but the
 * JWT-decoded user already carries an orgId, that value is preserved.
 */
@Injectable()
export class OrgIdInterceptor implements NestInterceptor {
    private readonly logger = new Logger(OrgIdInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();

        // 1. Try header first (explicit override / service-to-service calls)
        const headerOrgId = request.headers['x-org-id'] as string | undefined;

        // 2. Fallback to JWT-decoded orgId if header is absent
        const jwtOrgId = (request.user as { orgId?: string } | undefined)?.orgId;

        const resolvedOrgId = headerOrgId || jwtOrgId;

        if (resolvedOrgId) {
            (request as any).orgId = resolvedOrgId;
        }

        if (headerOrgId) {
            this.logger.debug(`Resolved orgId from x-org-id header: ${headerOrgId}`);
        }

        return next.handle();
    }
}
