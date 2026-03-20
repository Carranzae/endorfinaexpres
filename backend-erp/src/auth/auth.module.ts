import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RewardsModule } from '../rewards/rewards.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    RewardsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-erp-key',
      signOptions: { expiresIn: '8h' }, // 8 hours for a shift
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
