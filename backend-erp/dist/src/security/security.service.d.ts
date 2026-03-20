import { PrismaService } from '../prisma/prisma.service';
export declare class SecurityService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logAuditEvent(data: {
        userId?: string;
        eventType: string;
        severity?: 'low' | 'medium' | 'high' | 'critical';
        ipAddress?: string;
        userAgent?: string;
        details?: any;
    }): Promise<void>;
}
