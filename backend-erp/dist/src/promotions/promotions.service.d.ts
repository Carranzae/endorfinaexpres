import { PrismaService } from '../prisma/prisma.service';
export declare class PromotionsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(data: {
        title: string;
        description?: string;
        imageUrl?: string;
        videoUrl?: string;
        discountPercent?: number;
        discountAmount?: number;
        isActive?: boolean;
        startDate?: string;
        endDate?: string;
    }): Promise<{
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
    update(id: string, data: any): Promise<{
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
