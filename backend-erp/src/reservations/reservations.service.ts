import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ReservationUncheckedCreateInput) {
        // 1. Check if the table exists
        const table = await this.prisma.table.findUnique({ where: { id: data.tableId } });
        if (!table) throw new NotFoundException('Mesa no encontrada');

        // 2. Simple overlap check (In a real scenario, this would check time ranges)
        const existing = await this.prisma.reservation.findFirst({
            where: {
                tableId: data.tableId,
                reservationDate: data.reservationDate,
                reservationTime: data.reservationTime,
                status: { in: ['PENDING', 'CONFIRMED'] }
            }
        });

        if (existing) {
            throw new BadRequestException('La mesa ya está reservada para esa hora.');
        }

        return this.prisma.reservation.create({ data });
    }

    async findAll(date?: string) {
        const whereClause = date ? { reservationDate: new Date(date) } : {};
        return this.prisma.reservation.findMany({
            where: whereClause,
            include: { table: true },
            orderBy: [{ reservationDate: 'asc' }, { reservationTime: 'asc' }]
        });
    }

    async updateStatus(id: string, status: ReservationStatus) {
        return this.prisma.reservation.update({
            where: { id },
            data: { status },
            include: { table: true }
        });
    }
}
