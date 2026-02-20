import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { Organization } from '@prisma/client';

@Injectable()
export class OrganizationsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<Organization | null> {
        return this.prisma.organization.findUnique({ where: { id } });
    }

    async findBySlug(slug: string): Promise<Organization | null> {
        return this.prisma.organization.findUnique({ where: { slug } });
    }

    async update(
        id: string,
        data: { name?: string; slug?: string },
    ): Promise<Organization> {
        return this.prisma.organization.update({
            where: { id },
            data,
        });
    }
}
