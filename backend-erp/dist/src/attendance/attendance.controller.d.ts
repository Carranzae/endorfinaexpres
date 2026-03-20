import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AttendanceController {
    private readonly attendanceService;
    private readonly prisma;
    constructor(attendanceService: AttendanceService, prisma: PrismaService);
    checkIn(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: import("@prisma/client-runtime-utils").Decimal;
        employeeId: string;
    }>;
    checkOut(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: import("@prisma/client-runtime-utils").Decimal;
        employeeId: string;
    }>;
    getMyRecords(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: import("@prisma/client-runtime-utils").Decimal;
        employeeId: string;
    }[]>;
    findAll(): Promise<({
        employee: {
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: import("@prisma/client-runtime-utils").Decimal;
        employeeId: string;
    })[]>;
}
