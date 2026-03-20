import { PrismaService } from '../prisma/prisma.service';
import { QrSession } from '@prisma/client';
export declare class QrSessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createForTable(tableId: string): Promise<QrSession>;
    validateSession(token: string): Promise<QrSession | null>;
    closeSession(id: string): Promise<QrSession>;
    findAll(): Promise<QrSession[]>;
    createCustomerSession(data: any): Promise<any>;
}
