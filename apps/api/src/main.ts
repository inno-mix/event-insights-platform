import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // ─── Global Prefix ───
    const prefix = configService.get<string>('API_PREFIX', 'api/v1');
    app.setGlobalPrefix(prefix);

    // ─── CORS ───
    app.enableCors({
        origin: ['http://localhost:3000'], // Next.js dev server
        credentials: true,
    });

    // ─── Start ───
    const port = configService.get<number>('API_PORT', 4000);
    await app.listen(port);
    logger.log(`🚀 API running on http://localhost:${port}/${prefix}`);
}

bootstrap();
