import { Injectable } from '@nestjs/common';

/**
 * IAnalyticsLauncher — Interface for cross-module analytics communication.
 * The Events module uses this to trigger analytics tracking without
 * importing the Analytics module directly, preventing circular dependencies.
 */
export interface IAnalyticsLauncher {
    trackEvent(data: {
        eventId: string;
        orgId: string;
        sessionId?: string;
        payload?: Record<string, unknown>;
        userAgent?: string;
        ipAddress?: string;
    }): Promise<void>;
}

export const ANALYTICS_LAUNCHER = 'ANALYTICS_LAUNCHER';

/**
 * AnalyticsLauncher — Concrete implementation injected by the Analytics module.
 * This lives in shared/ so any module can depend on it without coupling to analytics/.
 */
@Injectable()
export class AnalyticsLauncherToken {
    // Token class used for DI — the actual implementation is provided by AnalyticsModule
}
