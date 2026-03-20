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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.product.create({ data });
    }
    async findAll(categoryId) {
        const whereClause = categoryId ? { categoryId, isActive: true } : { isActive: true };
        return this.prisma.product.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            include: { category: true }
        });
    }
    async findOne(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
    }
    async update(id, data) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async updateStock(id, quantityChange) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.BadRequestException('Producto no encontrado');
        const newStock = product.stockQuantity + quantityChange;
        if (newStock < 0) {
            throw new common_1.BadRequestException('El stock no puede ser negativo');
        }
        return this.prisma.product.update({
            where: { id },
            data: { stockQuantity: newStock },
        });
    }
    async findAllWithStock() {
        const products = await this.prisma.product.findMany({
            orderBy: { name: 'asc' },
            include: { category: true },
        });
        return products.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku || null,
            currentStock: p.stockQuantity,
            minStock: p.minStock,
            unit: p.unit || 'unidad',
            costPrice: Number(p.price),
            isActive: p.isActive,
            category: p.category,
        }));
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map