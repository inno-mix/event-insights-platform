import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { Event, EventType } from '@prisma/client';

@Injectable()
export class EventsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(orgId: string): Promise<Event[]> {
        return this.prisma.event.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string, orgId: string): Promise<Event | null> {
        return this.prisma.event.findFirst({
            where: { id, orgId },
        });
    }

    async create(
        data: { name: string; type?: EventType; description?: string },
        orgId: string,
    ): Promise<Event> {
        return this.prisma.event.create({
            data: {
                name: data.name,
                type: data.type || 'CUSTOM',
                description: data.description,
                orgId,
            },
        });
    }

    async update(
        id: string,
        data: { name?: string; type?: EventType; description?: string },
        orgId: string,
    ): Promise<Event> {
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, orgId: string): Promise<void> {
        await this.prisma.event.deleteMany({
            where: { id, orgId },
        });
    }
}
