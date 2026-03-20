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
var SecurityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SecurityService = SecurityService_1 = class SecurityService {
    prisma;
    logger = new common_1.Logger(SecurityService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logAuditEvent(data) {
        this.logger.log(`[AUDIT] ${data.severity?.toUpperCase() || 'LOW'} | ${data.eventType} | User: ${data.userId || 'System'}`);
        try {
            await this.prisma.securityLog.create({
                data: {
                    userId: data.userId,
                    eventType: data.eventType,
                    severity: data.severity || 'low',
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                    details: data.details ? JSON.stringify(data.details) : undefined,
                },
            });
        }
        catch (e) {
            this.logger.error('Failed to write Security Log to Database', e);
        }
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = SecurityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SecurityService);
//# sourceMappingURL=security.service.js.map