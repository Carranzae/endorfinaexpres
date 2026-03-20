"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BannersService = class BannersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.siteBanner.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async findActive(position) {
        const where = { isActive: true };
        if (position)
            where.position = position;
        return this.prisma.siteBanner.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async findOne(id) {
        const banner = await this.prisma.siteBanner.findUnique({ where: { id } });
        if (!banner)
            throw new common_1.NotFoundException('Banner no encontrado');
        return banner;
    }
    async create(data) {
        return this.prisma.siteBanner.create({
            data: {
                title: data.title,
                imageUrl: data.imageUrl,
                svgContent: data.svgContent,
                position: data.position || 'HERO',
                isActive: data.isActive ?? true,
                sortOrder: data.sortOrder ?? 0,
            },
        });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.siteBanner.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.siteBanner.delete({ where: { id } });
    }
    async reorder(ids) {
        const updates = ids.map((id, index) => this.prisma.siteBanner.update({
            where: { id },
            data: { sortOrder: index },
        }));
        return this.prisma.$transaction(updates);
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BannersService);
//# sourceMappingURL=banners.service.js.map