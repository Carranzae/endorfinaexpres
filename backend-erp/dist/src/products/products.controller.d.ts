import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: Prisma.ProductCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        price: Prisma.Decimal;
        stockQuantity: number;
        minStock: number;
        imageUrl: string | null;
        model3dUrl: string | null;
        categoryId: string;
    }>;
    findAll(categoryId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        price: Prisma.Decimal;
        stockQuantity: number;
        minStock: number;
        imageUrl: string | null;
        model3dUrl: string | null;
        categoryId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        price: Prisma.Decimal;
        stockQuantity: number;
        minStock: number;
        imageUrl: string | null;
        model3dUrl: string | null;
        categoryId: string;
    } | null>;
    update(id: string, updateProductDto: Prisma.ProductUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        price: Prisma.Decimal;
        stockQuantity: number;
        minStock: number;
        imageUrl: string | null;
        model3dUrl: string | null;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        price: Prisma.Decimal;
        stockQuantity: number;
        minStock: number;
        imageUrl: string | null;
        model3dUrl: string | null;
        categoryId: string;
    }>;
}
