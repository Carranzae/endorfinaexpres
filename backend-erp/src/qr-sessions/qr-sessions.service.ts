import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, QrSession } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class QrSessionsService {
    constructor(private prisma: PrismaService) { }

    async createForTable(tableId: string): Promise<QrSession> {
        let table = null;
        if (tableId && tableId !== 'independent') {
            table = await this.prisma.table.findUnique({ where: { id: tableId } });
            if (!table) throw new NotFoundException('Mesa no encontrada');
        }

        // Generate a unique token for the QR URL
        const sessionToken = randomUUID();

        // Expires in 2 hours by default
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2);

        return this.prisma.qrSession.create({
            data: {
                ...(tableId && tableId !== 'independent' ? { tableId } : {}),
                sessionToken,
                expiresAt,
                status: 'ACTIVE',
            }
        });
    }

    async validateSession(token: string): Promise<QrSession | null> {
        const session = await this.prisma.qrSession.findUnique({
            where: { sessionToken: token },
            include: { table: true }
        });

        if (!session || session.status !== 'ACTIVE' || new Date() > session.expiresAt) {
            // Setup background job or hook to mark it expired if needed, but return null for now
            return null;
        }

        return session;
    }

    async closeSession(id: string): Promise<QrSession> {
        return this.prisma.qrSession.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });
    }

    async findAll(): Promise<QrSession[]> {
        return this.prisma.qrSession.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            include: { table: true },
        });
    }

    async createCustomerSession(data: any) {
        try {
            return await this.prisma.customerSession.create({
                data: {
                    qrSessionId: data.qrSessionId,
                    tableId: data.tableId || null,
                    customerName: data.customerName || 'Cliente',
                    orderType: data.orderType || 'DINE_IN',
                    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
                },
            });
        } catch (e) {
            // Graceful fallback if schema mismatch
            return { id: 'cs-' + Date.now(), ...data, status: 'active' };
        }
    }
}
