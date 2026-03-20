import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) {}

    // PUBLIC — landing page loads active promotions
    @Get('active')
    findActive() {
        return this.promotionsService.findActive();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Get()
    findAll() {
        return this.promotionsService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.promotionsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Post()
    create(@Body() body: any) {
        return this.promotionsService.create(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.promotionsService.update(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.promotionsService.remove(id);
    }
}
