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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkIn(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existing = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: today,
            }
        });
        if (existing && existing.checkIn) {
            throw new common_1.BadRequestException('El empleado ya registró su entrada hoy.');
        }
        return this.prisma.attendance.create({
            data: {
                employeeId,
                date: today,
                checkIn: new Date(),
                status: client_1.AttendanceStatus.PRESENT,
            }
        });
    }
    async checkOut(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const record = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: today,
            }
        });
        if (!record || !record.checkIn) {
            throw new common_1.BadRequestException('No se encontró un registro de entrada previo para hoy.');
        }
        if (record.checkOut) {
            throw new common_1.BadRequestException('El empleado ya registró su salida hoy.');
        }
        const checkOutTime = new Date();
        const diffMs = checkOutTime.getTime() - record.checkIn.getTime();
        const hoursWorked = diffMs / (1000 * 60 * 60);
        return this.prisma.attendance.update({
            where: { id: record.id },
            data: {
                checkOut: checkOutTime,
                hoursWorked,
            }
        });
    }
    async getMyRecords(employeeId, limit = 30) {
        return this.prisma.attendance.findMany({
            where: { employeeId },
            orderBy: { date: 'desc' },
            take: limit,
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map