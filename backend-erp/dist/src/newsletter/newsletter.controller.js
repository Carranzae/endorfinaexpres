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
exports.NewsletterController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NewsletterController = class NewsletterController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSubscribers() {
        try {
            return await this.prisma.newsletterSubscriber.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (e) {
            return [];
        }
    }
    async subscribe(body) {
        try {
            return await this.prisma.newsletterSubscriber.upsert({
                where: { email: body.email.toLowerCase() },
                update: { firstName: body.firstName, lastName: body.lastName, phone: body.phone },
                create: {
                    email: body.email.toLowerCase(),
                    firstName: body.firstName,
                    lastName: body.lastName,
                    phone: body.phone,
                    isActive: true,
                },
            });
        }
        catch (e) {
            return { success: false, message: 'Error subscribing' };
        }
    }
    async removeSubscriber(id) {
        try {
            return await this.prisma.newsletterSubscriber.delete({ where: { id } });
        }
        catch (e) {
            return { success: false };
        }
    }
    async sendNewsletter(body) {
        console.log(`[NEWSLETTER] Sending "${body.subject}" to all subscribers`);
        return { success: true, message: 'Newsletter queued for sending' };
    }
};
exports.NewsletterController = NewsletterController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('subscribers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "getSubscribers", null);
__decorate([
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "subscribe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('subscribers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "removeSubscriber", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "sendNewsletter", null);
exports.NewsletterController = NewsletterController = __decorate([
    (0, common_1.Controller)('newsletter'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsletterController);
//# sourceMappingURL=newsletter.controller.js.map