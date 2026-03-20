import { QrSessionsService } from './qr-sessions.service';
export declare class QrSessionsController {
    private readonly qrSessionsService;
    constructor(qrSessionsService: QrSessionsService);
    createForTable(tableId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SessionStatus;
        customerName: string | null;
        orderType: string | null;
        tableId: string | null;
        sessionToken: string;
        isMultiSession: boolean;
        currentCustomerSessionId: string | null;
        expiresAt: Date;
    }>;
    validateSession(token: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SessionStatus;
        customerName: string | null;
        orderType: string | null;
        tableId: string | null;
        sessionToken: string;
        isMultiSession: boolean;
        currentCustomerSessionId: string | null;
        expiresAt: Date;
    } | {
        status: string;
        message: string;
    }>;
    createCustomerSession(body: any): Promise<any>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SessionStatus;
        customerName: string | null;
        orderType: string | null;
        tableId: string | null;
        sessionToken: string;
        isMultiSession: boolean;
        currentCustomerSessionId: string | null;
        expiresAt: Date;
    }[]>;
    closeSession(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SessionStatus;
        customerName: string | null;
        orderType: string | null;
        tableId: string | null;
        sessionToken: string;
        isMultiSession: boolean;
        currentCustomerSessionId: string | null;
        expiresAt: Date;
    }>;
}
