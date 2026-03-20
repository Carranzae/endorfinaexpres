import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventsGateway } from '../events/events.gateway';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly eventsGateway: EventsGateway,
    ) { }

    // PUBLIC: Customers create orders from QR flow (no JWT)
    @Post()
    async create(@Body() body: any) {
        // Build order data from frontend payload
        const orderData: any = {
            customerName: body.customerName || 'Cliente',
            orderType: body.type || body.orderType || 'DINE_IN',
            status: 'PENDING',
            subtotal: body.total || 0,
            total: body.total || 0,
            paymentStatus: 'PENDING',
        };

        // Connect table if provided
        if (body.tableId) {
            orderData.table = { connect: { id: body.tableId } };
        }

        // Connect QR session if provided
        if (body.sessionId) {
            orderData.qrSession = { connect: { id: body.sessionId } };
        }

        // Connect Waiter/User if provided
        if (body.waiterId || body.userId) {
            orderData.user = { connect: { id: body.waiterId || body.userId } };
        }

        // Create order first
        const order = await this.ordersService.create(orderData);

        // Create order items if provided
        if (body.items && Array.isArray(body.items)) {
            for (const item of body.items) {
                try {
                    await this.ordersService.createOrderItem({
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity || 1,
                        unitPrice: item.unitPrice || item.price || 0,
                        totalPrice: (item.unitPrice || item.price || 0) * (item.quantity || 1),
                        notes: item.notes,
                    });
                } catch (e) {
                    console.error('Error creating order item:', e);
                }
            }
        }

        // Re-fetch with items included
        const fullOrder = await this.ordersService.findOne(order.id);
        return fullOrder;
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    getStats() {
        return this.ordersService.getStats();
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('table/:tableId/active')
    findActiveByTable(@Param('tableId') tableId: string) {
        return this.ordersService.findActiveByTable(tableId);
    }

    // NEW endpoints for local auto-printing
    @UseGuards(JwtAuthGuard)
    @Get('unprinted/all')
    async findUnprinted() {
        return this.ordersService.findUnprinted();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/printed')
    async markAsPrinted(@Param('id') id: string) {
        return this.ordersService.markAsPrinted(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: any) {
        const order = await this.ordersService.updateStatus(id, status);
        // Broadcast status change via Socket.IO
        this.eventsGateway.broadcastOrderStatusChange(id, status);
        return order;
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderDto: Prisma.OrderUpdateInput) {
        return this.ordersService.update(id, updateOrderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.ordersService.updateStatus(id, 'CANCELLED');
    }
}
