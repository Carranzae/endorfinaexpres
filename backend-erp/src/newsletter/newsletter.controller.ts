import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('newsletter')
export class NewsletterController {
    constructor(private readonly prisma: PrismaService) { }

    @UseGuards(JwtAuthGuard)
    @Get('subscribers')
    async getSubscribers() {
        try {
            return await this.prisma.newsletterSubscriber.findMany({
                orderBy: { createdAt: 'desc' },
            });
        } catch (e) {
            return [];
        }
    }

    @Post('subscribe')
    async subscribe(@Body() body: { email: string; firstName?: string; lastName?: string; phone?: string }) {
        try {
            return await this.prisma.newsletterSubscriber.upsert({
                where: { email: body.email.toLowerCase() },
                update: { firstName: body.firstName, lastName: body.lastName, phone: body.phone },
                create: {
                    email: body.email.toLowerCase(),
                    firstName: body.firstName,
                    lastName: body.lastName,
                    phone: body.phone,
                    isActive: true,
                },
            });
        } catch (e) {
            return { success: false, message: 'Error subscribing' };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('subscribers/:id')
    async removeSubscriber(@Param('id') id: string) {
        try {
            return await this.prisma.newsletterSubscriber.delete({ where: { id } });
        } catch (e) {
            return { success: false };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('send')
    async sendNewsletter(@Body() body: { subject: string; body: string }) {
        // In production, integrate with email service (SendGrid, etc.)
        // For now, log the newsletter send attempt
        console.log(`[NEWSLETTER] Sending "${body.subject}" to all subscribers`);
        return { success: true, message: 'Newsletter queued for sending' };
    }
}
