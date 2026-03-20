import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// In-memory settings store (in production, use database or config file)
let appSettings: Record<string, any> = {
    restaurantName: 'Endorfina Express',
    restaurantAddress: 'Trujillo, Perú',
    restaurantPhone: '',
    restaurantRuc: '',
    currency: 'PEN',
    timezone: 'America/Lima',
    language: 'es',
    notificationSound: true,
    autoCloseOrders: false,
    allowMultipleQR: true,
    reservationEnabled: true,
    deliveryEnabled: true,
    rewardsEnabled: true,
};

@Controller('settings')
export class SettingsController {
    @UseGuards(JwtAuthGuard)
    @Get()
    getSettings() {
        return appSettings;
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    updateSettings(@Body() body: Record<string, any>) {
        appSettings = { ...appSettings, ...body };
        return appSettings;
    }
}
