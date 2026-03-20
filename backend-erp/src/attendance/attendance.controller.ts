import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
    constructor(
        private readonly attendanceService: AttendanceService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('check-in')
    checkIn(@Request() req: any) {
        return this.attendanceService.checkIn(req.user.userId);
    }

    @Post('check-out')
    checkOut(@Request() req: any) {
        return this.attendanceService.checkOut(req.user.userId);
    }

    @Get('my-records')
    getMyRecords(@Request() req: any) {
        return this.attendanceService.getMyRecords(req.user.userId);
    }

    // Admin: list all attendance records
    @Get()
    async findAll() {
        try {
            return await this.prisma.attendance.findMany({
                orderBy: { date: 'desc' },
                take: 100,
                include: {
                    employee: { select: { fullName: true, email: true, role: true } },
                },
            });
        } catch (e) {
            return [];
        }
    }
}
