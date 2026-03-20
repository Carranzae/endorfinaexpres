import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { SunatService } from './sunat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('sunat')
export class SunatController {
    constructor(
        private readonly sunatService: SunatService,
        private eventsGateway: EventsGateway,
        private prisma: PrismaService,
    ) { }

    // Admin: list all billing documents   
    @Get('invoices')
    async getInvoices() {
        try {
            return await this.prisma.billingDocument.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
        } catch (e) {
            return [];
        }
    }

    @Post('emit/:orderId')
    async emitDocument(
        @Param('orderId') orderId: string,
        @Body('documentType') documentType: '01' | '03'
    ) {
        // End-to-end flow
        // 1. Build XML
        const rawXml = await this.sunatService.buildUblXml(orderId, documentType);

        // 2. Sign XML (in a real app, PFX is read from env or database)
        const signedXml = rawXml; // Skipping actual signing step here for prototype

        // 3. Send to SUNAT
        const cdrBase64 = await this.sunatService.sendToSunat(
            signedXml,
            `20123456789-${documentType}-F001-1`,
            '20123456789MODDATOS',
            'moddatos'
        );

        // Notify Local Print Server to cut ticket for customer!
        this.eventsGateway.broadcastSunatTicket({
            orderId,
            documentType,
            xmlHash: 'hash-of-signed-xml',
        });

        // 4. Update Database Order/Billing Document with status
        return {
            message: 'Comprobante enviado exitosamente.',
            cdrData: cdrBase64 ? 'CDR Recibido' : 'En proceso',
            signedXml
        };
    }
}
