import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ReservationStatus } from '@prisma/client';
export declare class ReservationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ReservationUncheckedCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReservationStatus;
        customerName: string;
        notes: string | null;
        tableId: string;
        qrSessionId: string | null;
        reservationDate: Date;
        reservationTime: string;
        partySize: number;
    }>;
    findAll(date?: string): Promise<({
        table: {
            number: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            capacity: number;
            status: import(".prisma/client").$Enums.TableStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReservationStatus;
        customerName: string;
        notes: string | null;
        tableId: string;
        qrSessionId: string | null;
        reservationDate: Date;
        reservationTime: string;
        partySize: number;
    })[]>;
    updateStatus(id: string, status: ReservationStatus): Promise<{
        table: {
            number: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            capacity: number;
            status: import(".prisma/client").$Enums.TableStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReservationStatus;
        customerName: string;
        notes: string | null;
        tableId: string;
        qrSessionId: string | null;
        reservationDate: Date;
        reservationTime: string;
        partySize: number;
    }>;
}
