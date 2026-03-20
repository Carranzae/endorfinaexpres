import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
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
    create(body: any): Promise<{
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
    update(id: string, body: any): Promise<{
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
}
