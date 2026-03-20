import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { Prisma, InventoryMovement, MovementType } from '@prisma/client';

@Injectable()
export class InventoryService {
    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService
    ) { }

    async recordMovement(data: {
        productId: string;
        type: MovementType;
        quantity: number;
        reason?: string;
        userId?: string;
    }): Promise<InventoryMovement> {

        // Ensure accurate stock change depending on Movement IN / OUT
        const modifier = data.type === 'IN' || data.type === 'ADJUSTMENT' ? Math.abs(data.quantity) : -Math.abs(data.quantity);

        // Apply stock change to the product
        await this.productsService.updateStock(data.productId, modifier);

        // Record the explicit ERP movement
        return this.prisma.inventoryMovement.create({
            data: {
                productId: data.productId,
                movementType: data.type,
                quantity: data.quantity, // Keep absolute history record
                reason: data.reason,
                userId: data.userId,
            }
        });
    }

    async getMovementsHistory(productId?: string): Promise<InventoryMovement[]> {
        const where = productId ? { productId } : {};
        return this.prisma.inventoryMovement.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                product: true,
                user: { select: { fullName: true, email: true } }
            }
        });
    }
}
