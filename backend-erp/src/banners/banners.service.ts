import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannersService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.siteBanner.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
    }

    async findActive(position?: string) {
        const where: any = { isActive: true };
        if (position) where.position = position;
        return this.prisma.siteBanner.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
    }

    async findOne(id: string) {
        const banner = await this.prisma.siteBanner.findUnique({ where: { id } });
        if (!banner) throw new NotFoundException('Banner no encontrado');
        return banner;
    }

    async create(data: {
        title: string;
        imageUrl?: string;
        svgContent?: string;
        position?: string;
        isActive?: boolean;
        sortOrder?: number;
    }) {
        return this.prisma.siteBanner.create({
            data: {
                title: data.title,
                imageUrl: data.imageUrl,
                svgContent: data.svgContent,
                position: (data.position as any) || 'HERO',
                isActive: data.isActive ?? true,
                sortOrder: data.sortOrder ?? 0,
            },
        });
    }

    async update(id: string, data: any) {
        await this.findOne(id);
        return this.prisma.siteBanner.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.siteBanner.delete({ where: { id } });
    }

    async reorder(ids: string[]) {
        const updates = ids.map((id, index) =>
            this.prisma.siteBanner.update({
                where: { id },
                data: { sortOrder: index },
            }),
        );
        return this.prisma.$transaction(updates);
    }
}
