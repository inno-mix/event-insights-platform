import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, CreateEventSchema } from './dto/create-event.dto';
import { TenantGuard } from '@shared/guards/tenant.guard';
import { OrgId } from '@shared/decorators/org-id.decorator';
import { ZodValidationPipe } from '@shared/pipes/zod-validation.pipe';

@Controller('events')
@UseGuards(TenantGuard)
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    async findAll(@OrgId() orgId: string) {
        return this.eventsService.findAll(orgId);
    }

    @Get(':id')
    async findById(@Param('id') id: string, @OrgId() orgId: string) {
        return this.eventsService.findById(id, orgId);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(CreateEventSchema))
    async create(@Body() dto: CreateEventDto, @OrgId() orgId: string) {
        return this.eventsService.create(dto, orgId);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: Partial<CreateEventDto>,
        @OrgId() orgId: string,
    ) {
        return this.eventsService.update(id, dto, orgId);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @OrgId() orgId: string) {
        return this.eventsService.delete(id, orgId);
    }
}
