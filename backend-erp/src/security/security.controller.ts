import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('security')
export class SecurityController {
    constructor(private readonly prisma: PrismaService) { }

    @Get('audit-logs')
    async getAuditLogs() {
        try {
            return await this.prisma.securityLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 200,
                include: {
                    user: { select: { fullName: true, email: true } },
                },
            });
        } catch (e) {
            return [];
        }
    }
}
