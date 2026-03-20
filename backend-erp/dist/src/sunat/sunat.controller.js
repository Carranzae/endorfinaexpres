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
exports.SunatController = void 0;
const common_1 = require("@nestjs/common");
const sunat_service_1 = require("./sunat.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const events_gateway_1 = require("../events/events.gateway");
const prisma_service_1 = require("../prisma/prisma.service");
let SunatController = class SunatController {
    sunatService;
    eventsGateway;
    prisma;
    constructor(sunatService, eventsGateway, prisma) {
        this.sunatService = sunatService;
        this.eventsGateway = eventsGateway;
        this.prisma = prisma;
    }
    async getInvoices() {
        try {
            return await this.prisma.billingDocument.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
        }
        catch (e) {
            return [];
        }
    }
    async emitDocument(orderId, documentType) {
        const rawXml = await this.sunatService.buildUblXml(orderId, documentType);
        const signedXml = rawXml;
        const cdrBase64 = await this.sunatService.sendToSunat(signedXml, `20123456789-${documentType}-F001-1`, '20123456789MODDATOS', 'moddatos');
        this.eventsGateway.broadcastSunatTicket({
            orderId,
            documentType,
            xmlHash: 'hash-of-signed-xml',
        });
        return {
            message: 'Comprobante enviado exitosamente.',
            cdrData: cdrBase64 ? 'CDR Recibido' : 'En proceso',
            signedXml
        };
    }
};
exports.SunatController = SunatController;
__decorate([
    (0, common_1.Get)('invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SunatController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Post)('emit/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('documentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SunatController.prototype, "emitDocument", null);
exports.SunatController = SunatController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('sunat'),
    __metadata("design:paramtypes", [sunat_service_1.SunatService,
        events_gateway_1.EventsGateway,
        prisma_service_1.PrismaService])
], SunatController);
//# sourceMappingURL=sunat.controller.js.map