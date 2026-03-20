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
exports.RewardsController = void 0;
const common_1 = require("@nestjs/common");
const rewards_service_1 = require("./rewards.service");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let RewardsController = class RewardsController {
    rewardsService;
    prisma;
    constructor(rewardsService, prisma) {
        this.rewardsService = rewardsService;
        this.prisma = prisma;
    }
    async getCustomersWithPoints() {
        try {
            return await this.prisma.user.findMany({
                where: { role: 'CUSTOMER' },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    points: true,
                },
                orderBy: { points: 'desc' },
            });
        }
        catch (e) {
            return [];
        }
    }
    getMyBalance(req) {
        return this.rewardsService.getBalance(req.user.userId);
    }
    getUserBalance(userId) {
        return this.rewardsService.getBalance(userId);
    }
    getMyHistory(req) {
        return this.rewardsService.getHistory(req.user.userId);
    }
    spendPoints(req, body) {
        return this.rewardsService.spendPoints(req.user.userId, body.points, body.orderId);
    }
    givePoints(body) {
        return this.rewardsService.givePoints(body.userId, body.points, body.reason || 'Puntos otorgados por admin');
    }
    giveWelcomePoints(userId) {
        return this.rewardsService.giveWelcomePoints(userId);
    }
    getTopConsumers() {
        return this.rewardsService.getTopConsumers();
    }
    getAudit() {
        return this.rewardsService.getAudit();
    }
    getAnomalies() {
        return this.rewardsService.getAnomalies();
    }
    adjustPoints(body) {
        return this.rewardsService.adjustPoints(body.userId, body.points, body.reason || 'Ajuste de admin');
    }
};
exports.RewardsController = RewardsController;
__decorate([
    (0, common_1.Get)('customers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RewardsController.prototype, "getCustomersWithPoints", null);
__decorate([
    (0, common_1.Get)('balance'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getMyBalance", null);
__decorate([
    (0, common_1.Get)('balance/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getUserBalance", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getMyHistory", null);
__decorate([
    (0, common_1.Post)('spend'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "spendPoints", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATOR'),
    (0, common_1.Post)('give'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "givePoints", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATOR'),
    (0, common_1.Post)('welcome/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "giveWelcomePoints", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATOR'),
    (0, common_1.Get)('top-consumers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getTopConsumers", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATOR'),
    (0, common_1.Get)('audit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getAudit", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATOR'),
    (0, common_1.Get)('anomalies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getAnomalies", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMINISTRATOR'),
    (0, common_1.Post)('adjust'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "adjustPoints", null);
exports.RewardsController = RewardsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('rewards'),
    __metadata("design:paramtypes", [rewards_service_1.RewardsService,
        prisma_service_1.PrismaService])
], RewardsController);
//# sourceMappingURL=rewards.controller.js.map