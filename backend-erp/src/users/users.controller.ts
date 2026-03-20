import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles('ADMINISTRATOR')
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Roles('ADMINISTRATOR')
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Roles('ADMINISTRATOR')
    @Post()
    async create(@Body() body: {
        email: string;
        password: string;
        fullName: string;
        role: string;
        phone?: string;
    }) {
        return this.usersService.createUser(body);
    }

    @Roles('ADMINISTRATOR')
    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.usersService.updateUser(id, body);
    }

    @Roles('ADMINISTRATOR')
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
