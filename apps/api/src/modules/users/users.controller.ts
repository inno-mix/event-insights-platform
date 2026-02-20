import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TenantGuard } from '@shared/guards/tenant.guard';
import { OrgId } from '@shared/decorators/org-id.decorator';

@Controller('users')
@UseGuards(TenantGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(@OrgId() orgId: string) {
        return this.usersService.findAll(orgId);
    }

    @Get(':id')
    async findById(@Param('id') id: string, @OrgId() orgId: string) {
        return this.usersService.findById(id, orgId);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @OrgId() orgId: string,
        @Body() data: { name?: string; role?: 'OWNER' | 'ADMIN' | 'MEMBER' },
    ) {
        return this.usersService.update(id, orgId, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @OrgId() orgId: string) {
        return this.usersService.delete(id, orgId);
    }
}
