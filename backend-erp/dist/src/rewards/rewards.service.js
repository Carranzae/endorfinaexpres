"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RewardsService = class RewardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    EARN_RATE = 10;
    REDEEM_RATE = 100;
    WELCOME_POINTS = 50;
    async getBalance(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { points: true, fullName: true, email: true }
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return user;
    }
    async getHistory(userId) {
        return this.prisma.rewardTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { order: { select: { total: true, orderType: true } } }
        });
    }
    async addPointsForOrder(userId, orderId, orderTotal) {
        const pointsToEarn = Math.floor(orderTotal / this.EARN_RATE);
        if (pointsToEarn <= 0)
            return null;
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points: pointsToEarn, type: client_1.RewardType.EARNED, orderId, reason: 'Puntos por compra' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { increment: pointsToEarn } } });
            return transaction;
        });
    }
    async spendPoints(userId, pointsToSpend, orderId) {
        if (pointsToSpend <= 0)
            throw new common_1.BadRequestException('Puntos inválidos');
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user || user.points < pointsToSpend)
                throw new common_1.BadRequestException('Puntos insuficientes');
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points: pointsToSpend, type: client_1.RewardType.SPENT, orderId, reason: 'Canje de descuento en pedido' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { decrement: pointsToSpend } } });
            return { transaction, discountAmount: (pointsToSpend / this.REDEEM_RATE) * 10 };
        });
    }
    async givePoints(userId, points, reason) {
        if (points <= 0)
            throw new common_1.BadRequestException('Puntos debe ser > 0');
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new common_1.NotFoundException('Usuario no encontrado');
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points, type: client_1.RewardType.EARNED, reason: reason || 'Puntos otorgados por admin' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { increment: points } } });
            return transaction;
        });
    }
    async giveWelcomePoints(userId) {
        const existing = await this.prisma.rewardTransaction.findFirst({
            where: { userId, reason: 'Puntos de bienvenida' },
        });
        if (existing)
            return { message: 'Ya recibió puntos de bienvenida', transaction: existing };
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points: this.WELCOME_POINTS, type: client_1.RewardType.EARNED, reason: 'Puntos de bienvenida' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { increment: this.WELCOME_POINTS } } });
            return transaction;
        });
    }
    async getTopConsumers() {
        return this.prisma.user.findMany({
            where: { role: 'CUSTOMER' },
            select: {
                id: true, fullName: true, email: true, phone: true, points: true, createdAt: true,
                rewardTransactions: { where: { type: 'EARNED' }, select: { points: true } },
                orders: { select: { total: true } },
            },
            orderBy: { points: 'desc' },
            take: 10,
        });
    }
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
    async getAnomalies() {
        const anomalies = [];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
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
        const negativePoints = await this.prisma.user.findMany({
            where: { points: { lt: 0 } },
            select: { id: true, fullName: true, email: true, points: true },
        });
        for (const u of negativePoints) {
            anomalies.push({ type: 'NEGATIVE_BALANCE', severity: 'CRITICAL', userId: u.id, userName: u.fullName, email: u.email, points: u.points, message: `Balance negativo: ${u.points} puntos` });
        }
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
    async adjustPoints(userId, points, reason) {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new common_1.NotFoundException('Usuario no encontrado');
            const transaction = await tx.rewardTransaction.create({
                data: { userId, points: Math.abs(points), type: client_1.RewardType.ADJUSTMENT, reason: reason || 'Ajuste de admin' }
            });
            await tx.user.update({ where: { id: userId }, data: { points: { increment: points } } });
            return transaction;
        });
    }
};
exports.RewardsService = RewardsService;
exports.RewardsService = RewardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map