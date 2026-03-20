import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule], // Required to inject ProductsService
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule { }
