import { Controller, Post, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { QrSessionsService } from './qr-sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('qr-sessions')
export class QrSessionsController {
    constructor(private readonly qrSessionsService: QrSessionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('table/:tableId')
    createForTable(@Param('tableId') tableId: string) {
        return this.qrSessionsService.createForTable(tableId);
    }

    // PUBLIC: Customer scans QR
    @Get('validate/:token')
    async validateSession(@Param('token') token: string) {
        const session = await this.qrSessionsService.validateSession(token);
        if (!session) {
            return { status: 'expired', message: 'Sesión QR inválida o expirada.' };
        }
        return session;
    }

    // PUBLIC: Customer creates session data (name, order type, etc.)
    @Post('customer-session')
    async createCustomerSession(@Body() body: any) {
        return this.qrSessionsService.createCustomerSession(body);
    }

    // JWT: Admin lists all active sessions
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.qrSessionsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/close')
    closeSession(@Param('id') id: string) {
        return this.qrSessionsService.closeSession(id);
    }
}
