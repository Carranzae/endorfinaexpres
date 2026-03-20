import { RewardsService } from './rewards.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class RewardsController {
    private readonly rewardsService;
    private readonly prisma;
    constructor(rewardsService: RewardsService, prisma: PrismaService);
    getCustomersWithPoints(): Promise<{
        id: string;
        email: string;
        fullName: string;
        points: number;
    }[]>;
    getMyBalance(req: any): Promise<{
        email: string;
        fullName: string;
        points: number;
    }>;
    getUserBalance(userId: string): Promise<{
        email: string;
        fullName: string;
        points: number;
    }>;
    getMyHistory(req: any): Promise<({
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
    spendPoints(req: any, body: {
        points: number;
        orderId?: string;
    }): Promise<{
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
    givePoints(body: {
        userId: string;
        points: number;
        reason?: string;
    }): Promise<{
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
    adjustPoints(body: {
        userId: string;
        points: number;
        reason?: string;
    }): Promise<{
        id: string;
        points: number;
        createdAt: Date;
        userId: string;
        orderId: string | null;
        reason: string | null;
        type: import(".prisma/client").$Enums.RewardType;
    }>;
}
