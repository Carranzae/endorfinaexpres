import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RewardsService } from '../rewards/rewards.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private rewardsService: RewardsService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            }
        };
    }

    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await this.usersService.create({
            ...data,
            password: hashedPassword,
        });

        // Auto-grant 50 welcome points for CUSTOMER registrations
        if ((data.role || 'CUSTOMER') === 'CUSTOMER') {
            try {
                await this.rewardsService.giveWelcomePoints(newUser.id);
            } catch (e) {
                // Non-blocking: don't fail registration if points fail
            }
        }

        const { password, ...result } = newUser;
        return result;
    }
}
