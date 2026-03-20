import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category } from '@prisma/client';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category | null>;
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    remove(id: string): Promise<Category>;
}
