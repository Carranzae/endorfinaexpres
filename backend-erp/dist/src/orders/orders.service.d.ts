import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order, OrderStatus } from '@prisma/client';
import { EventsGateway } from '../events/events.gateway';
import { RewardsService } from '../rewards/rewards.service';
export declare class OrdersService {
    private prisma;
    private eventsGateway;
    private rewardsService;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway, rewardsService: RewardsService);
    create(data: Prisma.OrderCreateInput): Promise<Order>;
    findAll(): Promise<Order[]>;
    findActiveByTable(tableId: string): Promise<Order[]>;
    findOne(id: string): Promise<Order | null>;
    update(id: string, data: Prisma.OrderUpdateInput): Promise<Order>;
    findUnprinted(): Promise<Order[]>;
    markAsPrinted(id: string): Promise<Order>;
    updateStatus(id: string, status: OrderStatus): Promise<Order>;
    createOrderItem(data: {
        orderId: string;
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        notes?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        orderId: string;
        quantity: number;
        productId: string;
        unitPrice: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
    }>;
    getStats(): Promise<{
        dailySales: any[];
        salesByWaiter: any[];
        revenue: {
            today: any;
            week: any;
            month: any;
        };
        topProducts: any[];
        orderTypeDistribution: any[];
        alerts: {
            pendingOver15min: number;
            lowStock: any[] | never[];
        };
    }>;
}
