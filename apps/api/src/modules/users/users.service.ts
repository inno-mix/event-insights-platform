import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository) { }

    async findAll(orgId: string) {
        return this.repository.findAll(orgId);
    }

    async findById(id: string, orgId: string) {
        const user = await this.repository.findById(id, orgId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async update(
        id: string,
        orgId: string,
        data: { name?: string; role?: 'OWNER' | 'ADMIN' | 'MEMBER' },
    ) {
        await this.findById(id, orgId);
        return this.repository.update(id, orgId, data);
    }

    async delete(id: string, orgId: string) {
        await this.findById(id, orgId);
        return this.repository.delete(id, orgId);
    }
}
