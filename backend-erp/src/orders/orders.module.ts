import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { RewardsModule } from '../rewards/rewards.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [RewardsModule, EventsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule { }
