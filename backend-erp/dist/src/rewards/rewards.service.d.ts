import { PrismaService } from '../prisma/prisma.service';
export declare class RewardsService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly EARN_RATE;
    private readonly REDEEM_RATE;
    private readonly WELCOME_POINTS;
    getBalance(userId: string): Promise<{
        email: string;
        fullName: string;
        points: number;
    }>;
    getHistory(userId: string): Promise<({
        order: {
            orderType: import(".prisma/client").$Enums.OrderType;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
    } & {
        id: string;
        points: number;
        createdAt: Date;
        userId: string;
        orderId: string | null;
        reason: string | null;
        type: import(".prisma/client").$Enums.RewardType;
    })[]>;
    addPointsForOrder(userId: string, orderId: string, orderTotal: number): Promise<{
        id: string;
        points: number;
        createdAt: Date;
        userId: string;
        orderId: string | null;
        reason: string | null;
        type: import(".prisma/client").$Enums.RewardType;
    } | null>;
    spendPoints(userId: string, pointsToSpend: number, orderId?: string): Promise<{
        transaction: {
            id: string;
            points: number;
            createdAt: Date;
            userId: string;
            orderId: string | null;
            reason: string | null;
            type: import(".prisma/client").$Enums.RewardType;
        };
        discountAmount: number;
    }>;
    givePoints(userId: string, points: number, reason: string): Promise<{
        id: string;
        points: number;
        createdAt: Date;
        userId: string;
        orderId: string | null;
        reason: string | null;
        type: import(".prisma/client").$Enums.RewardType;
    }>;
    giveWelcomePoints(userId: string): Promise<{
        id: string;
        points: number;
        createdAt: Date;
        userId: string;
        orderId: string | null;
        reason: string | null;
        type: import(".prisma/client").$Enums.RewardType;
    } | {
        message: string;
        transaction: {
            id: string;
            points: number;
            createdAt: Date;
            userId: string;
            orderId: string | null;
            reason: string | null;
            type: import(".prisma/client").$Enums.RewardType;
        };
    }>;
    getTopConsumers(): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        points: number;
        createdAt: Date;
        orders: {
            total: import("@prisma/client-runtime-utils").Decimal;
        }[];
        rewardTransactions: {
            points: number;
        }[];
    }[]>;
    getAudit(): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            points: number;
        };
        order: {
            id: string;
            createdAt: Date;
            orderType: import(".prisma/client").$Enums.OrderType;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
    } & {
        id: string;
        points: number;
        createdAt: Date;
        userId: string;
        orderId: string | null;
        reason: string | null;
        type: import(".prisma/client").$Enums.RewardType;
    })[]>;
    getAnomalies(): Promise<any[]>;
    adjustPoints(userId: string, points: number, reason: string): Promise<{
        id: string;
        points: number;
        createdAt: Date;
        userId: string;
        orderId: string | null;
        reason: string | null;
        type: import(".prisma/client").$Enums.RewardType;
    }>;
}
