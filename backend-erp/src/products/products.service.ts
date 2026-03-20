import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.prisma.product.create({ data });
    }

    async findAll(categoryId?: string): Promise<Product[]> {
        const whereClause = categoryId ? { categoryId, isActive: true } : { isActive: true };
        return this.prisma.product.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            include: { category: true }
        });
    }

    async findOne(id: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
    }

    async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Product> {
        // Soft delete
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async updateStock(id: string, quantityChange: number): Promise<Product> {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new BadRequestException('Producto no encontrado');

        const newStock = product.stockQuantity + quantityChange;
        if (newStock < 0) {
            throw new BadRequestException('El stock no puede ser negativo');
        }

        return this.prisma.product.update({
            where: { id },
            data: { stockQuantity: newStock },
        });
    }

    // Used by Inventory page — shows ALL products (including inactive) with stock data
    async findAllWithStock(): Promise<any[]> {
        const products = await this.prisma.product.findMany({
            orderBy: { name: 'asc' },
            include: { category: true },
        });
        // Map to inventory-friendly format
        return products.map((p) => ({
            id: p.id,
            name: p.name,
            sku: (p as any).sku || null,
            currentStock: p.stockQuantity,
            minStock: p.minStock,
            unit: (p as any).unit || 'unidad',
            costPrice: Number(p.price),
            isActive: p.isActive,
            category: p.category,
        }));
    }
}
