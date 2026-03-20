import { Module } from '@nestjs/common';
import { SunatService } from './sunat.service';
import { SunatController } from './sunat.controller';

@Module({
  providers: [SunatService],
  controllers: [SunatController]
})
export class SunatModule {}
