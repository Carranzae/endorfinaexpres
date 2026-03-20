import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<Omit<User, 'password'>[]>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    createUser(data: {
        email: string;
        password: string;
        fullName: string;
        role: string;
        phone?: string;
    }): Promise<Omit<User, 'password'>>;
    updateUser(id: string, data: any): Promise<Omit<User, 'password'>>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
