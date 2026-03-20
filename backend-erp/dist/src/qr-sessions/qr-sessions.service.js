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
exports.QrSessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let QrSessionsService = class QrSessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createForTable(tableId) {
        let table = null;
        if (tableId && tableId !== 'independent') {
            table = await this.prisma.table.findUnique({ where: { id: tableId } });
            if (!table)
                throw new common_1.NotFoundException('Mesa no encontrada');
        }
        const sessionToken = (0, crypto_1.randomUUID)();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2);
        return this.prisma.qrSession.create({
            data: {
                ...(tableId && tableId !== 'independent' ? { tableId } : {}),
                sessionToken,
                expiresAt,
                status: 'ACTIVE',
            }
        });
    }
    async validateSession(token) {
        const session = await this.prisma.qrSession.findUnique({
            where: { sessionToken: token },
            include: { table: true }
        });
        if (!session || session.status !== 'ACTIVE' || new Date() > session.expiresAt) {
            return null;
        }
        return session;
    }
    async closeSession(id) {
        return this.prisma.qrSession.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });
    }
    async findAll() {
        return this.prisma.qrSession.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            include: { table: true },
        });
    }
    async createCustomerSession(data) {
        try {
            return await this.prisma.customerSession.create({
                data: {
                    qrSessionId: data.qrSessionId,
                    tableId: data.tableId || null,
                    customerName: data.customerName || 'Cliente',
                    orderType: data.orderType || 'DINE_IN',
                    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
                },
            });
        }
        catch (e) {
            return { id: 'cs-' + Date.now(), ...data, status: 'active' };
        }
    }
};
exports.QrSessionsService = QrSessionsService;
exports.QrSessionsService = QrSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QrSessionsService);
//# sourceMappingURL=qr-sessions.service.js.map