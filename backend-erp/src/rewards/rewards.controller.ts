import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardsController {
    constructor(
        private readonly rewardsService: RewardsService,
        private readonly prisma: PrismaService,
    ) { }

    // Admin: list all customers with their reward points  
    @Get('customers')
    async getCustomersWithPoints() {
        try {
            return await this.prisma.user.findMany({
                where: { role: 'CUSTOMER' as any },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    points: true,
                },
                orderBy: { points: 'desc' },
            });
        } catch (e) {
            return [];
        }
    }

    @Get('balance')
    getMyBalance(@Request() req: any) {
        return this.rewardsService.getBalance(req.user.userId);
    }

    @Get('balance/:userId')
    getUserBalance(@Param('userId') userId: string) {
        return this.rewardsService.getBalance(userId);
    }

    @Get('history')
    getMyHistory(@Request() req: any) {
        return this.rewardsService.getHistory(req.user.userId);
    }

    @Post('spend')
    spendPoints(@Request() req: any, @Body() body: { points: number; orderId?: string }) {
        return this.rewardsService.spendPoints(req.user.userId, body.points, body.orderId);
    }

    // ─── ADMIN ENDPOINTS ───

    @UseGuards(RolesGuard)
    @Roles('ADMINISTRATOR')
    @Post('give')
    givePoints(@Body() body: { userId: string; points: number; reason?: string }) {
        return this.rewardsService.givePoints(body.userId, body.points, body.reason || 'Puntos otorgados por admin');
    }

    @UseGuards(RolesGuard)
    @Roles('ADMINISTRATOR')
    @Post('welcome/:userId')
    giveWelcomePoints(@Param('userId') userId: string) {
        return this.rewardsService.giveWelcomePoints(userId);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMINISTRATOR')
    @Get('top-consumers')
    getTopConsumers() {
        return this.rewardsService.getTopConsumers();
    }

    @UseGuards(RolesGuard)
    @Roles('ADMINISTRATOR')
    @Get('audit')
    getAudit() {
        return this.rewardsService.getAudit();
    }

    @UseGuards(RolesGuard)
    @Roles('ADMINISTRATOR')
    @Get('anomalies')
    getAnomalies() {
        return this.rewardsService.getAnomalies();
    }

    @UseGuards(RolesGuard)
    @Roles('ADMINISTRATOR')
    @Post('adjust')
    adjustPoints(@Body() body: { userId: string; points: number; reason?: string }) {
        return this.rewardsService.adjustPoints(body.userId, body.points, body.reason || 'Ajuste de admin');
    }
}
