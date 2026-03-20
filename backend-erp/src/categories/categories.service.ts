import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        return this.prisma.category.create({ data });
    }

    async findAll(): Promise<Category[]> {
        return this.prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: { id },
            include: { products: { where: { isActive: true } } }
        });
    }

    async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Category> {
        // Soft delete
        return this.prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
