import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @OrgId() — Extracts the organization ID from the request.
 * Requires TenantGuard to have run first.
 *
 * Usage:
 *   @Get('data')
 *   getData(@OrgId() orgId: string) { ... }
 */
export const OrgId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.orgId || request.user?.orgId;
    },
);
