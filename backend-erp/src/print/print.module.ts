import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import { PrintController } from './print.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [PrintService],
  controllers: [PrintController],
  exports: [PrintService],
})
export class PrintModule {}
