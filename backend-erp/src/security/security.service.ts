import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecurityService {
    private readonly logger = new Logger(SecurityService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Logs a critical system or business domain event immutably.
     */
    async logAuditEvent(data: {
        userId?: string;
        eventType: string;
        severity?: 'low' | 'medium' | 'high' | 'critical';
        ipAddress?: string;
        userAgent?: string;
        details?: any;
    }) {
        this.logger.log(`[AUDIT] ${data.severity?.toUpperCase() || 'LOW'} | ${data.eventType} | User: ${data.userId || 'System'}`);

        try {
            await this.prisma.securityLog.create({
                data: {
                    userId: data.userId,
                    eventType: data.eventType,
                    severity: data.severity || 'low',
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                    details: data.details ? JSON.stringify(data.details) : undefined,
                },
            });
        } catch (e) {
            this.logger.error('Failed to write Security Log to Database', e);
        }
    }
}
