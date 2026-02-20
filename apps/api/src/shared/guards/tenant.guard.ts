import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * TenantGuard — Ensures every authenticated request has an org_id context.
 * Extracts orgId from the JWT-decoded user and attaches it to the request
 * for downstream use via @OrgId() decorator.
 */
@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as { orgId?: string } | undefined;

        if (!user?.orgId) {
            throw new ForbiddenException(
                'Tenant context is missing. Ensure your JWT contains an orgId claim.',
            );
        }

        // Attach orgId at request level for convenience
        (request as any).orgId = user.orgId;

        return true;
    }
}
