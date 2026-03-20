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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReservationsService = class ReservationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const table = await this.prisma.table.findUnique({ where: { id: data.tableId } });
        if (!table)
            throw new common_1.NotFoundException('Mesa no encontrada');
        const existing = await this.prisma.reservation.findFirst({
            where: {
                tableId: data.tableId,
                reservationDate: data.reservationDate,
                reservationTime: data.reservationTime,
                status: { in: ['PENDING', 'CONFIRMED'] }
            }
        });
        if (existing) {
            throw new common_1.BadRequestException('La mesa ya está reservada para esa hora.');
        }
        return this.prisma.reservation.create({ data });
    }
    async findAll(date) {
        const whereClause = date ? { reservationDate: new Date(date) } : {};
        return this.prisma.reservation.findMany({
            where: whereClause,
            include: { table: true },
            orderBy: [{ reservationDate: 'asc' }, { reservationTime: 'asc' }]
        });
    }
    async updateStatus(id, status) {
        return this.prisma.reservation.update({
            where: { id },
            data: { status },
            include: { table: true }
        });
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map