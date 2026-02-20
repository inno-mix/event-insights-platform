import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(orgId: string): Promise<User[]> {
        return this.prisma.user.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string, orgId: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: { id, orgId },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async update(
        id: string,
        orgId: string,
        data: { name?: string; role?: 'OWNER' | 'ADMIN' | 'MEMBER' },
    ): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, orgId: string): Promise<void> {
        await this.prisma.user.deleteMany({
            where: { id, orgId },
        });
    }
}
