import { PrismaService } from '../prisma/prisma.service';
export declare class BannersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        imageUrl: string | null;
        title: string;
        svgContent: string | null;
        position: import(".prisma/client").$Enums.BannerPosition;
        sortOrder: number;
    }[]>;
    findActive(position?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        imageUrl: string | null;
        title: string;
        svgContent: string | null;
        position: import(".prisma/client").$Enums.BannerPosition;
        sortOrder: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        imageUrl: string | null;
        title: string;
        svgContent: string | null;
        position: import(".prisma/client").$Enums.BannerPosition;
        sortOrder: number;
    }>;
    create(data: {
        title: string;
        imageUrl?: string;
        svgContent?: string;
        position?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        imageUrl: string | null;
        title: string;
        svgContent: string | null;
        position: import(".prisma/client").$Enums.BannerPosition;
        sortOrder: number;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        imageUrl: string | null;
        title: string;
        svgContent: string | null;
        position: import(".prisma/client").$Enums.BannerPosition;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        imageUrl: string | null;
        title: string;
        svgContent: string | null;
        position: import(".prisma/client").$Enums.BannerPosition;
        sortOrder: number;
    }>;
    reorder(ids: string[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        imageUrl: string | null;
        title: string;
        svgContent: string | null;
        position: import(".prisma/client").$Enums.BannerPosition;
        sortOrder: number;
    }[]>;
}
