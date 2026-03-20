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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const products_service_1 = require("../products/products.service");
let InventoryService = class InventoryService {
    prisma;
    productsService;
    constructor(prisma, productsService) {
        this.prisma = prisma;
        this.productsService = productsService;
    }
    async recordMovement(data) {
        const modifier = data.type === 'IN' || data.type === 'ADJUSTMENT' ? Math.abs(data.quantity) : -Math.abs(data.quantity);
        await this.productsService.updateStock(data.productId, modifier);
        return this.prisma.inventoryMovement.create({
            data: {
                productId: data.productId,
                movementType: data.type,
                quantity: data.quantity,
                reason: data.reason,
                userId: data.userId,
            }
        });
    }
    async getMovementsHistory(productId) {
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map