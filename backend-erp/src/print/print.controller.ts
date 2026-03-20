import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Logger } from '@nestjs/common';
import { PrintService } from './print.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface PrintInvoiceDto {
  orderId: string;
  customerName?: string;
  table?: string;
  items?: any[];
  total?: number;
  paidAt?: string;
  status?: string;
  type?: string;
  isPrinted?: boolean;
}

@Controller('print')
export class PrintController {
  private readonly logger = new Logger('PrintController');

  constructor(private readonly printService: PrintService) {}

  /**
   * POST /print/invoice
   * Frontend calls this when user clicks "Print Invoice" button
   * Marks order as printed and notifies kitchen-printer
   */
  @Post('invoice')
  @HttpCode(HttpStatus.OK)
  async printInvoice(@Body() data: PrintInvoiceDto) {
    this.logger.log(`📄 Print Invoice request for order: ${data.orderId}`);
    return this.printService.printInvoice(data);
  }

  /**
   * GET /print/invoices/unprinted
   * Kitchen-printer app calls this periodically to fetch manual invoices
   */
  @Get('invoices/unprinted')
  @HttpCode(HttpStatus.OK)
  async getUnprintedInvoices() {
    this.logger.debug('Fetching unprinted invoices for kitchen-printer');
    return this.printService.getUnprintedInvoices();
  }

  /**
   * POST /print/order
   * Frontend calls this to send order to kitchen printer
   * Automatic printing for kitchen orders
   */
  @Post('order')
  @HttpCode(HttpStatus.OK)
  async printOrder(@Body() data: PrintInvoiceDto) {
    this.logger.log(`🍽️ Print Order request for order: ${data.orderId}`);
    return this.printService.printOrder(data);
  }

  /**
   * GET /print/status
   * Kitchen-printer app calls this to check if backend is available
   * No authentication required - kitchen-printer needs to check availability
   */
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getPrintStatus() {
    return this.printService.getPrintStatus();
  }

  /**
   * GET /print/unprinted
   * Kitchen-printer app calls this periodically to fetch unprinted orders
   * Used by the Electron app for its polling mechanism
   * Authentication may be required via API key in future
   */
  @Get('unprinted')
  @HttpCode(HttpStatus.OK)
  async getUnprintedOrders() {
    this.logger.debug('Fetching unprinted orders for kitchen-printer');
    return this.printService.getUnprintedOrders();
  }

  /**
   * POST /print/mark-printed/:orderId
   * Kitchen-printer app calls this after successfully printing an order
   * Marks the order as printed in the database
   */
  @Post('mark-printed/:orderId')
  @HttpCode(HttpStatus.OK)
  async markAsPrinted(@Body() body: any) {
    const { orderId } = body;
    return this.printService.markAsPrinted(orderId);
  }
}
