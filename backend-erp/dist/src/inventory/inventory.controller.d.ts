import { InventoryService } from './inventory.service';
import { ProductsService } from '../products/products.service';
import { Prisma, MovementType } from '@prisma/client';
export declare class InventoryController {
    private readonly inventoryService;
    private readonly productsService;
    constructor(inventoryService: InventoryService, productsService: ProductsService);
    findAll(): Promise<any[]>;
    getWarehouses(): Promise<never[]>;
    create(body: any): Promise<{
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
    update(id: string, body: any): Promise<{
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
    adjustStock(id: string, body: {
        delta: number;
    }): Promise<{
        currentStock: number;
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
    recordMovement(movementDto: {
        productId: string;
        type: MovementType;
        quantity: number;
        reason?: string;
        userId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        movementType: import(".prisma/client").$Enums.MovementType;
        quantity: number;
        reason: string | null;
        productId: string;
    }>;
    getMovementsHistory(productId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        movementType: import(".prisma/client").$Enums.MovementType;
        quantity: number;
        reason: string | null;
        productId: string;
    }[]>;
}
