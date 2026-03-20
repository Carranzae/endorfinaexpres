import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order, OrderStatus } from '@prisma/client';
import { EventsGateway } from '../events/events.gateway';
import { RewardsService } from '../rewards/rewards.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway,
        private rewardsService: RewardsService,
    ) { }

    async create(data: Prisma.OrderCreateInput): Promise<Order> {
        const order = await this.prisma.order.create({
            data,
            include: {
                items: true,
            }
        });

        // Notify Frontend POS & Physical Printers
        this.eventsGateway.broadcastNewOrder(order);

        return order;
    }

    async findAll(): Promise<Order[]> {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                table: true,
                user: true,
            }
        });
    }

    async findActiveByTable(tableId: string): Promise<Order[]> {
        return this.prisma.order.findMany({
            where: {
                tableId,
                status: { in: ['PENDING', 'PREPARING', 'READY'] },
            },
            include: { items: true }
        });
    }

    async findOne(id: string): Promise<Order | null> {
        return this.prisma.order.findUnique({
            where: { id },
            include: { items: true, table: true }
        });
    }

    async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
        return this.prisma.order.update({
            where: { id },
            data,
        });
    }

    async findUnprinted(): Promise<Order[]> {
        return this.prisma.order.findMany({
            where: { isPrinted: false, status: { not: 'CANCELLED' } },
            include: { items: { include: { product: true } }, table: true },
            orderBy: { createdAt: 'asc' }
        });
    }

    async markAsPrinted(id: string): Promise<Order> {
        return this.prisma.order.update({
            where: { id },
            data: { isPrinted: true }
        });
    }

    async updateStatus(id: string, status: OrderStatus): Promise<Order> {
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: { user: true }
        });

        // Enterprise Feature: Add loyalty points when an order is completed/delivered
        if (status === 'DELIVERED' && updatedOrder.userId) {
            await this.rewardsService.addPointsForOrder(
                updatedOrder.userId,
                updatedOrder.id,
                Number(updatedOrder.total)
            );
        }

        return updatedOrder;
    }

    async createOrderItem(data: {
        orderId: string;
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        notes?: string;
    }) {
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

    /** Dashboard stats endpoint */
    async getStats() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 7);
        const monthStart = new Date(todayStart);
        monthStart.setDate(monthStart.getDate() - 30);

        // Daily sales (last 30 days)
        const dailySales = await this.prisma.$queryRawUnsafe<any[]>(`
            SELECT DATE("createdAt") as date, COUNT(*)::int as orders, COALESCE(SUM(total),0)::float as revenue
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
            GROUP BY DATE("createdAt") ORDER BY date ASC
        `, monthStart);

        // Sales by waiter
        const salesByWaiter = await this.prisma.$queryRawUnsafe<any[]>(`
            SELECT u."fullName" as name, COUNT(o.id)::int as orders, COALESCE(SUM(o.total),0)::float as revenue
            FROM "Order" o JOIN "User" u ON o."userId" = u.id
            WHERE o."createdAt" >= $1 AND o.status != 'CANCELLED'
            GROUP BY u."fullName" ORDER BY revenue DESC LIMIT 10
        `, monthStart);

        // Revenue today / week / month
        const [revenueToday] = await this.prisma.$queryRawUnsafe<any[]>(`
            SELECT COALESCE(SUM(total),0)::float as total, COUNT(*)::int as orders
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
        `, todayStart);
        const [revenueWeek] = await this.prisma.$queryRawUnsafe<any[]>(`
            SELECT COALESCE(SUM(total),0)::float as total, COUNT(*)::int as orders
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
        `, weekStart);
        const [revenueMonth] = await this.prisma.$queryRawUnsafe<any[]>(`
            SELECT COALESCE(SUM(total),0)::float as total, COUNT(*)::int as orders
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
        `, monthStart);

        // Top products
        const topProducts = await this.prisma.$queryRawUnsafe<any[]>(`
            SELECT p.name, SUM(oi.quantity)::int as sold, COALESCE(SUM(oi."totalPrice"),0)::float as revenue
            FROM "OrderItem" oi JOIN "Product" p ON oi."productId" = p.id
            JOIN "Order" o ON oi."orderId" = o.id
            WHERE o."createdAt" >= $1 AND o.status != 'CANCELLED'
            GROUP BY p.name ORDER BY sold DESC LIMIT 10
        `, monthStart);

        // Order type distribution
        const orderTypeDistribution = await this.prisma.$queryRawUnsafe<any[]>(`
            SELECT "orderType" as type, COUNT(*)::int as count
            FROM "Order" WHERE "createdAt" >= $1 AND status != 'CANCELLED'
            GROUP BY "orderType"
        `, monthStart);

        // Pending orders > 15min (alerts)
        const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
        const pendingAlerts = await this.prisma.order.count({
            where: { status: 'PENDING', createdAt: { lte: fifteenMinAgo } },
        });

        // Low stock products
        const lowStock = await this.prisma.$queryRawUnsafe<any[]>(`
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
}
