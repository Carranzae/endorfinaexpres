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
exports.QrSessionsController = void 0;
const common_1 = require("@nestjs/common");
const qr_sessions_service_1 = require("./qr-sessions.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let QrSessionsController = class QrSessionsController {
    qrSessionsService;
    constructor(qrSessionsService) {
        this.qrSessionsService = qrSessionsService;
    }
    createForTable(tableId) {
        return this.qrSessionsService.createForTable(tableId);
    }
    async validateSession(token) {
        const session = await this.qrSessionsService.validateSession(token);
        if (!session) {
            return { status: 'expired', message: 'Sesión QR inválida o expirada.' };
        }
        return session;
    }
    async createCustomerSession(body) {
        return this.qrSessionsService.createCustomerSession(body);
    }
    findAll() {
        return this.qrSessionsService.findAll();
    }
    closeSession(id) {
        return this.qrSessionsService.closeSession(id);
    }
};
exports.QrSessionsController = QrSessionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('table/:tableId'),
    __param(0, (0, common_1.Param)('tableId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QrSessionsController.prototype, "createForTable", null);
__decorate([
    (0, common_1.Get)('validate/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrSessionsController.prototype, "validateSession", null);
__decorate([
    (0, common_1.Post)('customer-session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrSessionsController.prototype, "createCustomerSession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QrSessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/close'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QrSessionsController.prototype, "closeSession", null);
exports.QrSessionsController = QrSessionsController = __decorate([
    (0, common_1.Controller)('qr-sessions'),
    __metadata("design:paramtypes", [qr_sessions_service_1.QrSessionsService])
], QrSessionsController);
//# sourceMappingURL=qr-sessions.controller.js.map