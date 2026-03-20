import { PromotionsService } from './promotions.service';
export declare class PromotionsController {
    private readonly promotionsService;
    constructor(promotionsService: PromotionsService);
    findActive(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
        imageUrl: string | null;
        title: string;
        videoUrl: string | null;
        discountPercent: number | null;
        startDate: Date | null;
        endDate: Date | null;
    }[]>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
        imageUrl: string | null;
        title: string;
        videoUrl: string | null;
        discountPercent: number | null;
        startDate: Date | null;
        endDate: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
        imageUrl: string | null;
        title: string;
        videoUrl: string | null;
        discountPercent: number | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    create(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
        imageUrl: string | null;
        title: string;
        videoUrl: string | null;
        discountPercent: number | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
        imageUrl: string | null;
        title: string;
        videoUrl: string | null;
        discountPercent: number | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
        imageUrl: string | null;
        title: string;
        videoUrl: string | null;
        discountPercent: number | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
}
