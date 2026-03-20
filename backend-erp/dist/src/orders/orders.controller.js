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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const events_gateway_1 = require("../events/events.gateway");
let OrdersController = class OrdersController {
    ordersService;
    eventsGateway;
    constructor(ordersService, eventsGateway) {
        this.ordersService = ordersService;
        this.eventsGateway = eventsGateway;
    }
    async create(body) {
        const orderData = {
            customerName: body.customerName || 'Cliente',
            orderType: body.type || body.orderType || 'DINE_IN',
            status: 'PENDING',
            subtotal: body.total || 0,
            total: body.total || 0,
            paymentStatus: 'PENDING',
        };
        if (body.tableId) {
            orderData.table = { connect: { id: body.tableId } };
        }
        if (body.sessionId) {
            orderData.qrSession = { connect: { id: body.sessionId } };
        }
        if (body.waiterId || body.userId) {
            orderData.user = { connect: { id: body.waiterId || body.userId } };
        }
        const order = await this.ordersService.create(orderData);
        if (body.items && Array.isArray(body.items)) {
            for (const item of body.items) {
                try {
                    await this.ordersService.createOrderItem({
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity || 1,
                        unitPrice: item.unitPrice || item.price || 0,
                        totalPrice: (item.unitPrice || item.price || 0) * (item.quantity || 1),
                        notes: item.notes,
                    });
                }
                catch (e) {
                    console.error('Error creating order item:', e);
                }
            }
        }
        const fullOrder = await this.ordersService.findOne(order.id);
        return fullOrder;
    }
    getStats() {
        return this.ordersService.getStats();
    }
    findAll() {
        return this.ordersService.findAll();
    }
    findActiveByTable(tableId) {
        return this.ordersService.findActiveByTable(tableId);
    }
    async findUnprinted() {
        return this.ordersService.findUnprinted();
    }
    async markAsPrinted(id) {
        return this.ordersService.markAsPrinted(id);
    }
    findOne(id) {
        return this.ordersService.findOne(id);
    }
    async updateStatus(id, status) {
        const order = await this.ordersService.updateStatus(id, status);
        this.eventsGateway.broadcastOrderStatusChange(id, status);
        return order;
    }
    update(id, updateOrderDto) {
        return this.ordersService.update(id, updateOrderDto);
    }
    async remove(id) {
        return this.ordersService.updateStatus(id, 'CANCELLED');
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('table/:tableId/active'),
    __param(0, (0, common_1.Param)('tableId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findActiveByTable", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('unprinted/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findUnprinted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/printed'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "markAsPrinted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        events_gateway_1.EventsGateway])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map