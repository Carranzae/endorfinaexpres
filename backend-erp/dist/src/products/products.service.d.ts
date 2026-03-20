import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ProductCreateInput): Promise<Product>;
    findAll(categoryId?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product | null>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<Product>;
    remove(id: string): Promise<Product>;
    updateStock(id: string, quantityChange: number): Promise<Product>;
    findAllWithStock(): Promise<any[]>;
}
