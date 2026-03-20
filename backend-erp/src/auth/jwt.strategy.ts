import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'endorfina-erp-jwt-s3cr3t-k3y-2026-pr0d-ch4ng3-m3',
        });
    }

    async validate(payload: any) {
        // This payload is the decoded JWT token
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
