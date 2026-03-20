import { Module } from '@nestjs/common';
import { QrSessionsService } from './qr-sessions.service';
import { QrSessionsController } from './qr-sessions.controller';

@Module({
  providers: [QrSessionsService],
  controllers: [QrSessionsController]
})
export class QrSessionsModule {}
