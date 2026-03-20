import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tables')
export class TablesController {
    constructor(private readonly tablesService: TablesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createTableDto: Prisma.TableCreateInput) {
        return this.tablesService.create(createTableDto);
    }

    // PUBLIC: Customers need to see available tables for table selection in QR flow
    @Get()
    findAll() {
        return this.tablesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tablesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTableDto: Prisma.TableUpdateInput) {
        return this.tablesService.update(id, updateTableDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tablesService.remove(id);
    }
}
