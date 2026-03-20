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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../events/events.gateway");
const rewards_service_1 = require("../rewards/rewards.service");
let OrdersService = class OrdersService {
    prisma;
    eventsGateway;
    rewardsService;
    constructor(prisma, eventsGateway, rewardsService) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
        this.rewardsService = rewardsService;
    }
    async create(data) {
        const order = await this.prisma.order.create({
            data,
            include: {
                items: true,
            }
        });
        this.eventsGateway.broadcastNewOrder(order);
        return order;
    }
    async findAll() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                table: true,
                user: true,
            }
        });
    }
    async findActiveByTable(tableId) {
        return this.prisma.order.findMany({
            where: {
                tableId,
                status: { in: ['PENDING', 'PREPARING', 'READY'] },
            },
            include: { items: true }
        });
    }
    async findOne(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { items: true, table: true }
        });
    }
    async update(id, data) {
        return this.prisma.order.update({
            where: { id },
            data,
        });
    }
    async findUnprinted() {
        return this.prisma.order.findMany({
            where: { isPrinted: false, status: { not: 'CANCELLED' } },
            include: { items: { include: { product: true } }, table: true },
            orderBy: { createdAt: 'asc' }
        });
    }
    async markAsPrinted(id) {
        return this.prisma.order.update({
            where: { id },
            data: { isPrinted: true }
        });
    }
    async updateStatus(id, status) {
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: { user: true }
        });
        if (status === 'DELIVERED' && updatedOrder.userId) {
            await this.rewardsService.addPointsForOrder(updatedOrder.userId, updatedOrder.id, Number(updatedOrder.total));
        }
        return updatedOrder;
    }
    async createOrderItem(data) {
        return this.prisma.orderItem.create({
            data: {
                orderId: data.orderId,
                productId: data.productId,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                totalPrice: data.totalPrice,
                notes: data.notes,
            },
        });
    }
    async getStats() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 7);
        const monthStart = new Date(todayStart);
        monthStart.setDate(monthStart.getDate() - 30);
        const dailySales = await this.prisma.$queryRawUnsafe(`
            SELECT DATE("createdAt") as date, COUNT(*)::int as orders, COALESCE(SUM(total),0)::float as revenue
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
            GROUP BY DATE("createdAt") ORDER BY date ASC
        `, monthStart);
        const salesByWaiter = await this.prisma.$queryRawUnsafe(`
            SELECT u."fullName" as name, COUNT(o.id)::int as orders, COALESCE(SUM(o.total),0)::float as revenue
            FROM "Order" o JOIN "User" u ON o."userId" = u.id
            WHERE o."createdAt" >= $1 AND o.status != 'CANCELLED'
            GROUP BY u."fullName" ORDER BY revenue DESC LIMIT 10
        `, monthStart);
        const [revenueToday] = await this.prisma.$queryRawUnsafe(`
            SELECT COALESCE(SUM(total),0)::float as total, COUNT(*)::int as orders
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
        `, todayStart);
        const [revenueWeek] = await this.prisma.$queryRawUnsafe(`
            SELECT COALESCE(SUM(total),0)::float as total, COUNT(*)::int as orders
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
        `, weekStart);
        const [revenueMonth] = await this.prisma.$queryRawUnsafe(`
            SELECT COALESCE(SUM(total),0)::float as total, COUNT(*)::int as orders
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
        `, monthStart);
        const topProducts = await this.prisma.$queryRawUnsafe(`
            SELECT p.name, SUM(oi.quantity)::int as sold, COALESCE(SUM(oi."totalPrice"),0)::float as revenue
            FROM "OrderItem" oi JOIN "Product" p ON oi."productId" = p.id
            JOIN "Order" o ON oi."orderId" = o.id
            WHERE o."createdAt" >= $1 AND o.status != 'CANCELLED'
            GROUP BY p.name ORDER BY sold DESC LIMIT 10
        `, monthStart);
        const orderTypeDistribution = await this.prisma.$queryRawUnsafe(`
            SELECT "orderType" as type, COUNT(*)::int as count
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
            GROUP BY "orderType"
        `, monthStart);
        const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
        const pendingAlerts = await this.prisma.order.count({
            where: { status: 'PENDING', createdAt: { lte: fifteenMinAgo } },
        });
        const lowStock = await this.prisma.$queryRawUnsafe(`
            SELECT name, "stockQuantity", "minStock"
            FROM "Product" WHERE "stockQuantity" <= "minStock" AND "isActive" = true
            LIMIT 10
        `).catch(() => []);
        return {
            dailySales,
            salesByWaiter,
            revenue: {
                today: revenueToday || { total: 0, orders: 0 },
                week: revenueWeek || { total: 0, orders: 0 },
                month: revenueMonth || { total: 0, orders: 0 },
            },
            topProducts,
            orderTypeDistribution,
            alerts: {
                pendingOver15min: pendingAlerts,
                lowStock,
            },
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway,
        rewards_service_1.RewardsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map