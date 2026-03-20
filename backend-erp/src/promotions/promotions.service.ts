import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findActive() {
        const now = new Date();
        return this.prisma.promotion.findMany({
            where: {
                isActive: true,
                OR: [
                    { startDate: null, endDate: null },
                    { startDate: { lte: now }, endDate: null },
                    { startDate: null, endDate: { gte: now } },
                    { startDate: { lte: now }, endDate: { gte: now } },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const promo = await this.prisma.promotion.findUnique({ where: { id } });
        if (!promo) throw new NotFoundException('Promoción no encontrada');
        return promo;
    }

    async create(data: {
        title: string;
        description?: string;
        imageUrl?: string;
        videoUrl?: string;
        discountPercent?: number;
        discountAmount?: number;
        isActive?: boolean;
        startDate?: string;
        endDate?: string;
    }) {
        return this.prisma.promotion.create({
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                videoUrl: data.videoUrl,
                discountPercent: data.discountPercent,
                discountAmount: data.discountAmount,
                isActive: data.isActive ?? true,
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
            },
        });
    }

    async update(id: string, data: any) {
        await this.findOne(id);
        const updateData: any = { ...data };
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);
        return this.prisma.promotion.update({ where: { id }, data: updateData });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.promotion.delete({ where: { id } });
    }
}
