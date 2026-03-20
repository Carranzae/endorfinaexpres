import { PrismaService } from '../prisma/prisma.service';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    checkIn(employeeId: string): Promise<{
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
    checkOut(employeeId: string): Promise<{
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
    getMyRecords(employeeId: string, limit?: number): Promise<{
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
}
