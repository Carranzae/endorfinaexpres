import { PrismaService } from '../prisma/prisma.service';
export declare class SecurityController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAuditLogs(): Promise<({
        user: {
            email: string;
            fullName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        eventType: string;
        severity: string;
        ipAddress: string | null;
        userAgent: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
}
