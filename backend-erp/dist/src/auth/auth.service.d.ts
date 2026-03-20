import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RewardsService } from '../rewards/rewards.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private rewardsService;
    constructor(usersService: UsersService, jwtService: JwtService, rewardsService: RewardsService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
        };
    }>;
    register(data: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
