import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('banners')
export class BannersController {
    constructor(private readonly bannersService: BannersService) {}

    // PUBLIC — landing page loads active banners
    @Get('active')
    findActive(@Query('position') position?: string) {
        return this.bannersService.findActive(position);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Get()
    findAll() {
        return this.bannersService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bannersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Post()
    create(@Body() body: any) {
        return this.bannersService.create(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Post('reorder')
    reorder(@Body('ids') ids: string[]) {
        return this.bannersService.reorder(ids);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.bannersService.update(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMINISTRATOR')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bannersService.remove(id);
    }
}
