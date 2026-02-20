import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(private readonly repository: EventsRepository) { }

    async findAll(orgId: string) {
        return this.repository.findAll(orgId);
    }

    async findById(id: string, orgId: string) {
        const event = await this.repository.findById(id, orgId);
        if (!event) {
            throw new NotFoundException('Event not found');
        }
        return event;
    }

    async create(dto: CreateEventDto, orgId: string) {
        return this.repository.create(dto, orgId);
    }

    async update(
        id: string,
        dto: Partial<CreateEventDto>,
        orgId: string,
    ) {
        await this.findById(id, orgId);
        return this.repository.update(id, dto, orgId);
    }

    async delete(id: string, orgId: string) {
        await this.findById(id, orgId);
        return this.repository.delete(id, orgId);
    }
}
