import { PrismaService } from '../prisma/prisma.service';
import { ComplaintStatus } from '@prisma/client';
export declare class ComplaintsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        email?: string;
        phone?: string;
        issue: string;
    }): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        issue: string;
    }>;
    findAll(): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        issue: string;
    }[]>;
    updateStatus(id: string, status: ComplaintStatus): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        issue: string;
    }>;
}
