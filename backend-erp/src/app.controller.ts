import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth() {
    try {
      // Intenta una operación simple para verificar la conexión
      const productsCount = await this.prisma.product.count();
      return {
        status: 'online',
        message: 'Endorfina ERP Backend is running',
        database: 'connected',
        stats: {
          products: productsCount
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'online',
        message: 'Endorfina ERP Backend is running but Database connection is failing',
        database: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}
