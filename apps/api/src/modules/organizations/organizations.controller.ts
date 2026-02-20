import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { TenantGuard } from '@shared/guards/tenant.guard';
import { OrgId } from '@shared/decorators/org-id.decorator';

@Controller('organizations')
@UseGuards(TenantGuard)
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

    @Get('me')
    async getCurrentOrg(@OrgId() orgId: string) {
        return this.organizationsService.findById(orgId);
    }

    @Patch('me')
    async updateCurrentOrg(
        @OrgId() orgId: string,
        @Body() data: { name?: string },
    ) {
        return this.organizationsService.update(orgId, data);
    }
}
