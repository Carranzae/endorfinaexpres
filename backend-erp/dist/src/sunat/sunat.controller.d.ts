import { SunatService } from './sunat.service';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../prisma/prisma.service';
export declare class SunatController {
    private readonly sunatService;
    private eventsGateway;
    private prisma;
    constructor(sunatService: SunatService, eventsGateway: EventsGateway, prisma: PrismaService);
    getInvoices(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BillingStatus;
        customerName: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        paymentMethod: string;
        documentType: import(".prisma/client").$Enums.DocumentType;
        documentNumber: string;
        customerRuc: string | null;
        customerAddress: string | null;
        customerEmail: string | null;
        customerPhone: string | null;
        igvIncluded: boolean;
        igvAmount: import("@prisma/client-runtime-utils").Decimal;
        sunatStatus: import(".prisma/client").$Enums.SunatStatus;
        sunatCdr: string | null;
        sunatXml: string | null;
        sunatHash: string | null;
        qrCode: string | null;
        orderId: string | null;
        createdById: string | null;
    }[]>;
    emitDocument(orderId: string, documentType: '01' | '03'): Promise<{
        message: string;
        cdrData: string;
        signedXml: string;
    }>;
}
