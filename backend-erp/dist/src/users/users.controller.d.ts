import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Omit<{
        id: string;
        email: string;
        fullName: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }, "password">[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(body: {
        email: string;
        password: string;
        fullName: string;
        role: string;
        phone?: string;
    }): Promise<Omit<{
        id: string;
        email: string;
        fullName: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }, "password">>;
    update(id: string, body: any): Promise<Omit<{
        id: string;
        email: string;
        fullName: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }, "password">>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
