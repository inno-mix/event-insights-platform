import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';

@Injectable()
export class OrganizationsService {
    constructor(private readonly repository: OrganizationsRepository) { }

    async findById(orgId: string) {
        const org = await this.repository.findById(orgId);
        if (!org) {
            throw new NotFoundException('Organization not found');
        }
        return org;
    }

    async update(orgId: string, data: { name?: string }) {
        await this.findById(orgId); // Ensure exists
        const slug = data.name
            ? data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            : undefined;
        return this.repository.update(orgId, { ...data, slug });
    }
}
