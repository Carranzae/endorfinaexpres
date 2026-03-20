import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findAll(): Promise<Omit<User, 'password'>[]> {
        const users = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return users.map(({ password, ...rest }) => rest as any);
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async createUser(data: {
        email: string;
        password: string;
        fullName: string;
        role: string;
        phone?: string;
    }): Promise<Omit<User, 'password'>> {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) throw new BadRequestException('El email ya está registrado');

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                fullName: data.fullName,
                role: data.role as any,
                phone: data.phone,
            },
        });
        const { password, ...rest } = user;
        return rest as any;
    }

    async updateUser(id: string, data: any): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const updateData: any = {};
        if (data.fullName) updateData.fullName = data.fullName;
        if (data.email) updateData.email = data.email;
        if (data.role) updateData.role = data.role;
        if (data.phone) updateData.phone = data.phone;
        if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

        const updated = await this.prisma.user.update({ where: { id }, data: updateData });
        const { password, ...rest } = updated;
        return rest as any;
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        await this.prisma.user.delete({ where: { id } });
        return { message: 'Usuario eliminado' };
    }
}
