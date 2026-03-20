import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';
import { QrSessionsModule } from './qr-sessions/qr-sessions.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { SunatModule } from './sunat/sunat.module';
import { EventsModule } from './events/events.module';
import { RewardsModule } from './rewards/rewards.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ReservationsModule } from './reservations/reservations.module';
import { SecurityModule } from './security/security.module';
import { SettingsModule } from './settings/settings.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { SystemModule } from './system/system.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { PromotionsModule } from './promotions/promotions.module';
import { UploadModule } from './upload/upload.module';
import { BannersModule } from './banners/banners.module';
import { PrintModule } from './print/print.module';


@Module({
  imports: [
    // Global Cache Config
    CacheModule.register({
      isGlobal: true,
      ttl: 60000, // 60 seconds by default
    }),
    // DDoS / Brute Force Protection (Max 60 requests per minute per IP)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    PrismaModule, UsersModule, AuthModule, ComplaintsModule, TablesModule, OrdersModule, QrSessionsModule, CategoriesModule, ProductsModule, InventoryModule, SunatModule, EventsModule, RewardsModule, AttendanceModule, ReservationsModule, SecurityModule, SettingsModule, NewsletterModule, SystemModule, PromotionsModule, BannersModule, UploadModule, PrintModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Enable Rate Limiting Globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule { }
