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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const products_service_1 = require("../products/products.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let InventoryController = class InventoryController {
    inventoryService;
    productsService;
    constructor(inventoryService, productsService) {
        this.inventoryService = inventoryService;
        this.productsService = productsService;
    }
    async findAll() {
        return this.productsService.findAllWithStock();
    }
    async getWarehouses() {
        return [];
    }
    async create(body) {
        return this.productsService.create({
            name: body.name,
            sku: body.sku || undefined,
            price: 0,
            stockQuantity: body.currentStock || 0,
            minStock: body.minStock || 5,
            category: body.categoryId ? { connect: { id: body.categoryId } } : undefined,
        });
    }
    async update(id, body) {
        const data = {};
        if (body.name !== undefined)
            data.name = body.name;
        if (body.sku !== undefined)
            data.sku = body.sku;
        if (body.currentStock !== undefined)
            data.stockQuantity = body.currentStock;
        if (body.minStock !== undefined)
            data.minStock = body.minStock;
        if (body.costPrice !== undefined)
            data.price = body.costPrice;
        if (body.unit !== undefined)
            data.unit = body.unit;
        return this.productsService.update(id, data);
    }
    async adjustStock(id, body) {
        const product = await this.productsService.updateStock(id, body.delta);
        return { currentStock: product.stockQuantity };
    }
    async remove(id) {
        return this.productsService.remove(id);
    }
    recordMovement(movementDto) {
        return this.inventoryService.recordMovement(movementDto);
    }
    getMovementsHistory(productId) {
        return this.inventoryService.getMovementsHistory(productId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('warehouses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getWarehouses", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/adjust'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('movement'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "recordMovement", null);
__decorate([
    (0, common_1.Get)('movements'),
    __param(0, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMovementsHistory", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService,
        products_service_1.ProductsService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map