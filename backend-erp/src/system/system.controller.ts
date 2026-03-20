import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('system')
export class SystemController {
    @Get('info')
    getSystemInfo() {
        const mem = process.memoryUsage();
        return {
            uptime: process.uptime(),
            nodeVersion: process.version,
            platform: process.platform,
            memoryUsage: {
                rss: mem.rss,
                heapUsed: mem.heapUsed,
                heapTotal: mem.heapTotal,
            },
            dbStatus: 'Connected',
        };
    }
}
