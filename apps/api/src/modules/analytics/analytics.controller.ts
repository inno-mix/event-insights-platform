import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    UseGuards,
    UsePipes,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import {
    TrackEventDto,
    TrackEventSchema,
    QueryMetricsDto,
    QueryMetricsSchema,
} from './dto/query-metrics.dto';
import { TenantGuard } from '@shared/guards/tenant.guard';
import { Public } from '@shared/decorators/public.decorator';
import { OrgId } from '@shared/decorators/org-id.decorator';
import { ZodValidationPipe } from '@shared/pipes/zod-validation.pipe';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    /**
     * POST /analytics/track — Public ingestion endpoint (tracking pixel).
     * Accepts raw events and pushes to MongoDB.
     */
    @Public()
    @Post('track')
    @UsePipes(new ZodValidationPipe(TrackEventSchema))
    async trackEvent(@Body() dto: TrackEventDto, @Req() req: Request) {
        // Extract org context from the event payload or a query param
        const orgId = (req.query.orgId as string) || '';
        await this.analyticsService.trackEvent({
            ...dto,
            orgId,
            userAgent: dto.userAgent || req.headers['user-agent'] || '',
            ipAddress: dto.ipAddress || req.ip || '',
        });
        return { success: true };
    }

    /**
     * GET /analytics/metrics — Authenticated dashboard endpoint.
     * Queries pre-aggregated data from PostgreSQL.
     */
    @Get('metrics')
    @UseGuards(TenantGuard)
    async queryMetrics(
        @OrgId() orgId: string,
        @Query(new ZodValidationPipe(QueryMetricsSchema)) query: QueryMetricsDto,
    ) {
        return this.analyticsService.queryMetrics(orgId, query);
    }

    /**
     * GET /analytics/summary — Authenticated summary for KPI cards.
     */
    @Get('summary')
    @UseGuards(TenantGuard)
    async getMetricsSummary(
        @OrgId() orgId: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.analyticsService.getMetricsSummary(orgId, startDate, endDate);
    }
}
