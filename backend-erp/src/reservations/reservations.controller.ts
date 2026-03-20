import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Prisma, ReservationStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    // Public endpoint for customers booking from Web
    @Post()
    create(@Body() createDto: Prisma.ReservationUncheckedCreateInput) {
        // Convert string date to JS Date object if needed
        if (typeof createDto.reservationDate === 'string') {
            createDto.reservationDate = new Date(createDto.reservationDate);
        }
        return this.reservationsService.create(createDto);
    }

    // Protected endpoint for staff
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('date') date?: string) {
        return this.reservationsService.findAll(date);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: ReservationStatus) {
        return this.reservationsService.updateStatus(id, status);
    }
}
