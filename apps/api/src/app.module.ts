import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';

// ─── Infrastructure ───
import { PrismaModule } from '@infra/prisma/prisma.module';
import { MongooseConfigModule } from '@infra/mongoose/mongoose-config.module';

// ─── Shared ───
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { OrgIdInterceptor } from '@shared/interceptors/org-id.interceptor';

// ─── Domain Modules ───
import { AuthModule } from '@modules/auth/auth.module';
import { OrganizationsModule } from '@modules/organizations/organizations.module';
import { UsersModule } from '@modules/users/users.module';
import { EventsModule } from '@modules/events/events.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';

@Module({
    imports: [
        // ─── Configuration ───
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../../.env',
        }),

        // ─── BullMQ (Redis) ───
        BullModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.get<string>('REDIS_HOST', 'localhost'),
                    port: configService.get<number>('REDIS_PORT', 6379),
                },
            }),
            inject: [ConfigService],
        }),

        // ─── Infrastructure ───
        PrismaModule,
        MongooseConfigModule,

        // ─── Domain Modules ───
        AuthModule,
        OrganizationsModule,
        UsersModule,
        EventsModule,
        AnalyticsModule,
    ],
    providers: [
        // ─── Global JWT Auth Guard ───
        // Every endpoint requires auth by default; use @Public() to opt out
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },

        // ─── Global OrgId Interceptor ───
        // Extracts x-org-id from headers and attaches it to request.orgId
        // Runs on every request before guards evaluate tenant context
        {
            provide: APP_INTERCEPTOR,
            useClass: OrgIdInterceptor,
        },
    ],
})
export class AppModule { }
