import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async checkIn(employeeId: string) {
        // Determine the current working day (ignoring time for the date record)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // See if the employee already checked in today
        const existing = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: today,
            }
        });

        if (existing && existing.checkIn) {
            throw new BadRequestException('El empleado ya registró su entrada hoy.');
        }

        return this.prisma.attendance.create({
            data: {
                employeeId,
                date: today,
                checkIn: new Date(),
                status: AttendanceStatus.PRESENT, // Advanced logic could set LATE based on time
            }
        });
    }

    async checkOut(employeeId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: today,
            }
        });

        if (!record || !record.checkIn) {
            throw new BadRequestException('No se encontró un registro de entrada previo para hoy.');
        }
        if (record.checkOut) {
            throw new BadRequestException('El empleado ya registró su salida hoy.');
        }

        const checkOutTime = new Date();
        // Calculate hours worked
        const diffMs = checkOutTime.getTime() - record.checkIn.getTime();
        const hoursWorked = diffMs / (1000 * 60 * 60);

        return this.prisma.attendance.update({
            where: { id: record.id },
            data: {
                checkOut: checkOutTime,
                hoursWorked,
            }
        });
    }

    async getMyRecords(employeeId: string, limit: number = 30) {
        return this.prisma.attendance.findMany({
            where: { employeeId },
            orderBy: { date: 'desc' },
            take: limit,
        });
    }
}
