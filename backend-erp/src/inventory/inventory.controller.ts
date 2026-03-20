import { Controller, Post, Get, Body, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ProductsService } from '../products/products.service';
import { Prisma, MovementType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
    constructor(
        private readonly inventoryService: InventoryService,
        private readonly productsService: ProductsService,
    ) { }

    // GET /inventory — Lists all products as inventory items (stock info)
    @Get()
    async findAll() {
        return this.productsService.findAllWithStock();
    }

    // GET /inventory/warehouses — Placeholder (could add real warehouse model later)
    @Get('warehouses')
    async getWarehouses() {
        return [];
    }

    // POST /inventory — Creates a product (used by inventory page)
    @Post()
    async create(@Body() body: any) {
        return this.productsService.create({
            name: body.name,
            sku: body.sku || undefined,
            price: 0,
            stockQuantity: body.currentStock || 0,
            minStock: body.minStock || 5,
            category: body.categoryId ? { connect: { id: body.categoryId } } : undefined,
        } as any);
    }

    // PATCH /inventory/:id — Updates product stock/info
    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        const data: any = {};
        if (body.name !== undefined) data.name = body.name;
        if (body.sku !== undefined) data.sku = body.sku;
        if (body.currentStock !== undefined) data.stockQuantity = body.currentStock;
        if (body.minStock !== undefined) data.minStock = body.minStock;
        if (body.costPrice !== undefined) data.price = body.costPrice;
        if (body.unit !== undefined) data.unit = body.unit;
        return this.productsService.update(id, data);
    }

    // PATCH /inventory/:id/adjust — Quick stock adjustment (+/- delta)
    @Patch(':id/adjust')
    async adjustStock(@Param('id') id: string, @Body() body: { delta: number }) {
        const product = await this.productsService.updateStock(id, body.delta);
        return { currentStock: product.stockQuantity };
    }

    // DELETE /inventory/:id — Soft-deletes a product
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

    // POST /inventory/movement — Records an inventory movement
    @Post('movement')
    recordMovement(
        @Body() movementDto: {
            productId: string;
            type: MovementType;
            quantity: number;
            reason?: string;
            userId?: string;
        }
    ) {
        return this.inventoryService.recordMovement(movementDto);
    }

    // GET /inventory/movements — Movement history
    @Get('movements')
    getMovementsHistory(@Query('productId') productId?: string) {
        return this.inventoryService.getMovementsHistory(productId);
    }
}
