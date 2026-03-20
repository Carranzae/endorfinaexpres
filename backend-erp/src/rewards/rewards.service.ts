import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RewardType } from '@prisma/client';

@Injectable()
export class RewardsService {
    constructor(private prisma: PrismaService) { }

    private readonly EARN_RATE = 10;
    private readonly REDEEM_RATE = 100;
    private readonly WELCOME_POINTS = 50;

    async getBalance(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { points: true, fullName: true, email: true }
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    async getHistory(userId: string) {
        return this.prisma.rewardTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { order: { select: { total: true, orderType: true } } }
        });
    }

    async addPointsForOrder(userId: string, orderId: string, orderTotal: number) {
        const pointsToEarn = Math.floor(orderTotal / this.EARN_RATE);
        if (pointsToEarn <= 0) return null;
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points: pointsToEarn, type: RewardType.EARNED, orderId, reason: 'Puntos por compra' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { increment: pointsToEarn } } });
            return transaction;
        });
    }

    async spendPoints(userId: string, pointsToSpend: number, orderId?: string) {
        if (pointsToSpend <= 0) throw new BadRequestException('Puntos inválidos');
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user || user.points < pointsToSpend) throw new BadRequestException('Puntos insuficientes');
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points: pointsToSpend, type: RewardType.SPENT, orderId, reason: 'Canje de descuento en pedido' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { decrement: pointsToSpend } } });
            return { transaction, discountAmount: (pointsToSpend / this.REDEEM_RATE) * 10 };
        });
    }

    // ─── NUEVOS ENDPOINTS ───

    /** Admin da puntos manualmente */
    async givePoints(userId: string, points: number, reason: string) {
        if (points <= 0) throw new BadRequestException('Puntos debe ser > 0');
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new NotFoundException('Usuario no encontrado');
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points, type: RewardType.EARNED, reason: reason || 'Puntos otorgados por admin' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { increment: points } } });
            return transaction;
        });
    }

    /** Puntos de bienvenida al registrarse */
    async giveWelcomePoints(userId: string) {
        // Verificar que no haya recibido ya bienvenida
        const existing = await this.prisma.rewardTransaction.findFirst({
            where: { userId, reason: 'Puntos de bienvenida' },
        });
        if (existing) return { message: 'Ya recibió puntos de bienvenida', transaction: existing };

        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points: this.WELCOME_POINTS, type: RewardType.EARNED, reason: 'Puntos de bienvenida' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { increment: this.WELCOME_POINTS } } });
            return transaction;
        });
    }

    /** Top 10 clientes por puntos acumulados (consumo) */
    async getTopConsumers() {
        return this.prisma.user.findMany({
            where: { role: 'CUSTOMER' as any },
            select: {
                id: true, fullName: true, email: true, phone: true, points: true, createdAt: true,
                rewardTransactions: { where: { type: 'EARNED' }, select: { points: true } },
                orders: { select: { total: true } },
            },
            orderBy: { points: 'desc' },
            take: 10,
        });
    }

    /** Auditoría completa de transacciones */
    async getAudit() {
        return this.prisma.rewardTransaction.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
            include: {
                user: { select: { id: true, fullName: true, email: true, points: true } },
                order: { select: { id: true, total: true, orderType: true, createdAt: true } },
            },
        });
    }

    /** Detección de anomalías: patrones sospechosos */
    async getAnomalies() {
        const anomalies: any[] = [];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // 1. Múltiples canjes en <1 hora
        const recentSpends = await this.prisma.rewardTransaction.groupBy({
            by: ['userId'],
            where: { type: 'SPENT', createdAt: { gte: oneHourAgo } },
            _count: { id: true },
            having: { id: { _count: { gte: 3 } } },
        });
        for (const r of recentSpends) {
            const user = await this.prisma.user.findUnique({ where: { id: r.userId }, select: { fullName: true, email: true } });
            anomalies.push({ type: 'MULTIPLE_REDEEMS', severity: 'HIGH', userId: r.userId, userName: user?.fullName, email: user?.email, count: r._count.id, message: `${r._count.id} canjes en la última hora` });
        }

        // 2. Usuarios con puntos negativos
        const negativePoints = await this.prisma.user.findMany({
            where: { points: { lt: 0 } },
            select: { id: true, fullName: true, email: true, points: true },
        });
        for (const u of negativePoints) {
            anomalies.push({ type: 'NEGATIVE_BALANCE', severity: 'CRITICAL', userId: u.id, userName: u.fullName, email: u.email, points: u.points, message: `Balance negativo: ${u.points} puntos` });
        }

        // 3. Exceso de puntos ganados en 24h (>500 pts/día = sospechoso)
        const highEarners = await this.prisma.rewardTransaction.groupBy({
            by: ['userId'],
            where: { type: 'EARNED', createdAt: { gte: oneDayAgo } },
            _sum: { points: true },
        });
        for (const h of highEarners) {
            if ((h._sum.points || 0) > 500) {
                const user = await this.prisma.user.findUnique({ where: { id: h.userId }, select: { fullName: true, email: true } });
                anomalies.push({ type: 'EXCESSIVE_EARNING', severity: 'MEDIUM', userId: h.userId, userName: user?.fullName, email: user?.email, pointsEarned: h._sum.points, message: `${h._sum.points} pts ganados en 24h` });
            }
        }

        // 4. Múltiples bienvenidas (intento de duplicar)
        const welcomeDupes = await this.prisma.rewardTransaction.groupBy({
            by: ['userId'],
            where: { reason: 'Puntos de bienvenida' },
            _count: { id: true },
            having: { id: { _count: { gte: 2 } } },
        });
        for (const w of welcomeDupes) {
            const user = await this.prisma.user.findUnique({ where: { id: w.userId }, select: { fullName: true, email: true } });
            anomalies.push({ type: 'DUPLICATE_WELCOME', severity: 'HIGH', userId: w.userId, userName: user?.fullName, email: user?.email, count: w._count.id, message: `${w._count.id} bonos de bienvenida recibidos` });
        }

        return anomalies;
    }

    /** Admin ajusta (reduce) puntos de un usuario */
    async adjustPoints(userId: string, points: number, reason: string) {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new NotFoundException('Usuario no encontrado');
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points: Math.abs(points), type: RewardType.ADJUSTMENT, reason: reason || 'Ajuste de admin' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { increment: points } } });
            return transaction;
        });
    }
}
