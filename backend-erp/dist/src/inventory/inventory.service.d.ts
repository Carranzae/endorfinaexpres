import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { InventoryMovement, MovementType } from '@prisma/client';
export declare class InventoryService {
    private prisma;
    private productsService;
    constructor(prisma: PrismaService, productsService: ProductsService);
    recordMovement(data: {
        productId: string;
        type: MovementType;
        quantity: number;
        reason?: string;
        userId?: string;
    }): Promise<InventoryMovement>;
    getMovementsHistory(productId?: string): Promise<InventoryMovement[]>;
}
